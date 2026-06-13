import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { SharedModule } from '../../../../../shared/shared.module';
import { MoveStateService } from '../../services/move-state.service';
import { WorkflowDesignerService } from '../../services/workflow-designer.service';
import { RbacService } from '../../../rbac/services/rbac.service';
import { LayoutService } from '../../../../../core/services/layout.service';
import { MovePhaseResponse, MoveStatusResponse } from '../../models/move-state.model';
import { MoveStatus, MoveStatusTransition } from '../../models/workflow-designer.model';
import { Role } from '../../../rbac/models/rbac.models';
import { ToastService } from '../../../../../shared/services/toast.service';

interface PaletteGroup {
  phase: MovePhaseResponse;
  statuses: MoveStatusResponse[];
  collapsed: boolean;
}

@Component({
  selector: 'app-workflow-designer',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  templateUrl: './workflow-designer.component.html',
  styleUrls: ['./workflow-designer.component.css']
})
export class WorkflowDesignerComponent implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  private originalSidebarState = false;

  phases: MovePhaseResponse[] = [];
  paletteGroups: PaletteGroup[] = [];
  activeNodes: MoveStatus[] = [];
  transitions: MoveStatusTransition[] = [];
  roles: Role[] = [];

  selectedNode: MoveStatus | null = null;
  selectedEdge: MoveStatusTransition | null = null;

  isLoading = true;
  isSaving = false;
  isPropertiesCollapsed = false;

  // Zoom and Pan state
  zoomScale = 1.0;
  panX = 100;
  panY = 100;

  // Panning interaction state
  isPanning = false;
  panStartX = 0;
  panStartY = 0;

  // Dragging node interaction state
  isDraggingNode = false;
  draggedNode: MoveStatus | null = null;
  dragStartX = 0;
  dragStartY = 0;
  nodeStartX = 0;
  nodeStartY = 0;

  // Connection drawing interaction state
  isConnecting = false;
  sourceNode: MoveStatus | null = null;
  connStartX = 0;
  connStartY = 0;
  connEndX = 0;
  connEndY = 0;

  private connStartTime = 0;
  private connStartMouseX = 0;
  private connStartMouseY = 0;
  private isClickConnecting = false;

  constructor(
    private moveStateService: MoveStateService,
    private workflowService: WorkflowDesignerService,
    private rbacService: RbacService,
    private layoutService: LayoutService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    // Collapse sidebar for maximum designer canvas width
    this.layoutService.isSidebarCollapsed$.pipe(take(1)).subscribe(val => {
      this.originalSidebarState = val;
      this.layoutService.setSidebarCollapsed(true);
    });
  }

  ngOnDestroy(): void {
    // Restore sidebar state when leaving designer page
    this.layoutService.setSidebarCollapsed(this.originalSidebarState);
  }

  loadInitialData(): void {
    this.isLoading = true;
    
    // Load phases, roles, and current workflow
    forkJoin({
      phases: this.moveStateService.getPhases(),
      roles: this.rbacService.getRoles(0, 100),
      workflow: this.workflowService.getWorkflow()
    }).subscribe({
      next: (result) => {
        this.phases = result.phases;
        this.roles = result.roles?.content || [];
        
        // Setup initial nodes and transitions
        const workflowNodes = result.workflow?.nodes || [];
        this.transitions = result.workflow?.transitions || [];

        // Load statuses for each phase to populate the palette
        const statusRequests = this.phases.map(p => this.moveStateService.getStatusesByPhaseId(p.id));
        
        if (statusRequests.length > 0) {
          forkJoin(statusRequests).subscribe({
            next: (statusesList) => {
              // Populate palette groups
              this.paletteGroups = this.phases.map((p, idx) => ({
                phase: p,
                statuses: statusesList[idx] || [],
                collapsed: idx > 1 // Collapse all except first two phases initially
              }));

              // Map loaded workflow nodes and assign default coordinates if they don't have them
              const allBackendStatuses = statusesList.reduce((acc, current) => acc.concat(current), []);
              
              // We construct activeNodes from backend statuses matched with saved coordinates, filtering out nodes without saved coordinates
              this.activeNodes = workflowNodes
                .filter((wNode: any) => wNode.x !== null && wNode.x !== undefined)
                .map((wNode: any) => {
                  const matchedStatus = allBackendStatuses.find(s => s.id === wNode.id);
                  return {
                    id: wNode.id,
                    code: matchedStatus?.code || wNode.code || 'UNKNOWN',
                    name: matchedStatus?.name || wNode.name || 'Unknown',
                    phaseCode: matchedStatus?.phase?.code || wNode.phaseCode || 'UNKNOWN',
                    colorCode: matchedStatus?.colorCode || wNode.colorCode || '#8892b0',
                    customerVisible: matchedStatus?.customerVisible ?? wNode.customerVisible ?? true,
                    internalOnly: matchedStatus?.internalOnly ?? wNode.internalOnly ?? false,
                    x: wNode.x,
                    y: wNode.y
                  };
                });

              // Add any missing backend statuses that are already present in transitions just in case
              this.transitions.forEach(trans => {
                [trans.fromStatusId, trans.toStatusId].forEach(statusId => {
                  if (!this.activeNodes.find(n => n.id === statusId)) {
                    const matchedStatus = allBackendStatuses.find(s => s.id === statusId);
                    if (matchedStatus) {
                      this.activeNodes.push({
                        id: matchedStatus.id,
                        code: matchedStatus.code,
                        name: matchedStatus.name,
                        phaseCode: matchedStatus.phase?.code || 'UNKNOWN',
                        colorCode: matchedStatus.colorCode || '#8892b0',
                        customerVisible: matchedStatus.customerVisible,
                        internalOnly: matchedStatus.internalOnly,
                        x: 100,
                        y: 100
                      });
                    }
                  }
                });
              });

              // On load, we want the designer to be clean/empty unless explicitly placed/saved
              // So we skip autoLayoutMissingCoordinates()
              this.isLoading = false;
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error loading statuses:', err);
              this.toastService.showError('Failed to load statuses.');
              this.isLoading = false;
              this.cdr.detectChanges();
            }
          });
        } else {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error loading initial data:', err);
        this.toastService.showError('Failed to load initial data.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  autoLayoutMissingCoordinates(): void {
    let currentX = 100;
    let currentY = 100;
    this.activeNodes.forEach(node => {
      if (node.x === undefined || node.x === null || node.x === 0) {
        node.x = currentX;
        node.y = currentY;
        currentX += 240;
        if (currentX > 800) {
          currentX = 100;
          currentY += 150;
        }
      }
    });
  }

  // --- HTML5 Drag and Drop from Palette ---
  onDragStart(event: DragEvent, status: MoveStatusResponse): void {
    const statusData = {
      id: status.id,
      code: status.code,
      name: status.name,
      phaseCode: status.phase?.code || 'UNKNOWN',
      colorCode: status.colorCode || '#8892b0',
      customerVisible: status.customerVisible,
      internalOnly: status.internalOnly
    };
    event.dataTransfer?.setData('application/json', JSON.stringify(statusData));
  }

  addStatusToCanvas(status: MoveStatusResponse): void {
    const statusData: MoveStatus = {
      id: status.id,
      code: status.code,
      name: status.name,
      phaseCode: status.phase?.code || 'UNKNOWN',
      colorCode: status.colorCode || '#8892b0',
      customerVisible: status.customerVisible,
      internalOnly: status.internalOnly,
      // Place in the visible center area of the current view
      x: Math.round(-this.panX / this.zoomScale + 250),
      y: Math.round(-this.panY / this.zoomScale + 150)
    };

    const existingIndex = this.activeNodes.findIndex(n => n.id === statusData.id);
    if (existingIndex !== -1) {
      // Bring back in view if coordinates were lost or hidden
      this.activeNodes[existingIndex].x = statusData.x;
      this.activeNodes[existingIndex].y = statusData.y;
      this.selectedNode = this.activeNodes[existingIndex];
      this.toastService.showInfo(`Moved existing node to view center: ${statusData.name}`);
    } else {
      this.activeNodes.push(statusData);
      this.selectedNode = statusData;
      this.toastService.showSuccess(`Added status to canvas: ${statusData.name}`);
    }
    this.selectedEdge = null;
    this.cdr.detectChanges();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Required to allow drop
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const statusJson = event.dataTransfer?.getData('application/json');
    if (!statusJson) return;

    try {
      const statusData = JSON.parse(statusJson) as MoveStatus;
      const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
      const x = (event.clientX - rect.left - this.panX) / this.zoomScale;
      const y = (event.clientY - rect.top - this.panY) / this.zoomScale;

      const existingIndex = this.activeNodes.findIndex(n => n.id === statusData.id);
      if (existingIndex !== -1) {
        // Just move existing node
        this.activeNodes[existingIndex].x = Math.round(x - 100);
        this.activeNodes[existingIndex].y = Math.round(y - 40);
        this.toastService.showInfo(`Repositioned node: ${statusData.name}`);
      } else {
        // Add new node to canvas
        this.activeNodes.push({
          ...statusData,
          x: Math.round(x - 100),
          y: Math.round(y - 40)
        });
        this.toastService.showSuccess(`Added node to canvas: ${statusData.name}`);
      }
      this.cdr.detectChanges();
    } catch (e) {
      console.error('Failed to parse drag data', e);
    }
  }

  // --- Zoom and Pan Control ---
  zoomIn(): void {
    this.zoomScale = Math.min(2.0, this.zoomScale + 0.1);
  }

  zoomOut(): void {
    this.zoomScale = Math.max(0.3, this.zoomScale - 0.1);
  }

  resetZoomPan(): void {
    this.zoomScale = 1.0;
    this.panX = 100;
    this.panY = 100;
  }

  // --- Node Dragging & Selection ---
  onNodeMouseDown(node: MoveStatus, event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('conn-handle') || target.classList.contains('node-delete-btn')) {
      return; // Do not drag node if clicking connection handle or delete
    }

    event.stopPropagation();
    event.preventDefault();

    this.isDraggingNode = true;
    this.draggedNode = node;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.nodeStartX = node.x || 0;
    this.nodeStartY = node.y || 0;
  }

  selectNode(node: MoveStatus, event: MouseEvent): void {
    event.stopPropagation();
    
    // Click-to-connect handling
    if (this.isConnecting && this.sourceNode) {
      if (this.sourceNode.id === node.id) {
        // Cancel if clicking the same node
        this.isConnecting = false;
        this.isClickConnecting = false;
        this.sourceNode = null;
        this.toastService.showInfo('Connection cancelled.');
        this.cdr.detectChanges();
        return;
      }
      this.createNewTransition(this.sourceNode, node);
      this.isConnecting = false;
      this.isClickConnecting = false;
      this.sourceNode = null;
      this.cdr.detectChanges();
      return;
    }

    this.selectedNode = node;
    this.selectedEdge = null;
    this.isPropertiesCollapsed = false;
  }

  deleteNode(node: MoveStatus, event: MouseEvent): void {
    event.stopPropagation();
    this.activeNodes = this.activeNodes.filter(n => n.id !== node.id);
    
    this.transitions = this.transitions.filter(t => t.fromStatusId !== node.id && t.toStatusId !== node.id);

    if (this.selectedNode?.id === node.id) {
      this.selectedNode = null;
    }
    this.toastService.showInfo(`Removed ${node.name} from canvas.`);
  }

  // --- Drawing Connections ---
  onStartConnection(node: MoveStatus, event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    this.isConnecting = true;
    this.isClickConnecting = false;
    this.sourceNode = node;
    this.connStartX = (node.x || 0) + 200;
    this.connStartY = (node.y || 0) + 40;
    this.connEndX = this.connStartX;
    this.connEndY = this.connStartY;
    this.connStartTime = Date.now();
    this.connStartMouseX = event.clientX;
    this.connStartMouseY = event.clientY;
  }

  // --- Edge Path Calculations ---
  getEdgePath(edge: MoveStatusTransition): string {
    const fromNode = this.activeNodes.find(n => n.id === edge.fromStatusId);
    const toNode = this.activeNodes.find(n => n.id === edge.toStatusId);
    if (!fromNode || !toNode) return '';

    const x1 = (fromNode.x || 0) + 200;
    const y1 = (fromNode.y || 0) + 40;
    const x2 = toNode.x || 0;
    const y2 = (toNode.y || 0) + 40;

    const controlOffset = Math.max(100, Math.abs(x2 - x1) / 2);
    const cx1 = x1 + controlOffset;
    const cy1 = y1;
    const cx2 = x2 - controlOffset;
    const cy2 = y2;

    return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  }

  getTempEdgePath(): string {
    if (!this.isConnecting) return '';
    const x1 = this.connStartX;
    const y1 = this.connStartY;
    const x2 = this.connEndX;
    const y2 = this.connEndY;

    const controlOffset = Math.max(100, Math.abs(x2 - x1) / 2);
    const cx1 = x1 + controlOffset;
    const cy1 = y1;
    const cx2 = x2 - controlOffset;
    const cy2 = y2;

    return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  }

  selectEdge(edge: MoveStatusTransition, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedEdge = edge;
    this.selectedNode = null;
    this.isPropertiesCollapsed = false;
  }

  togglePropertiesPanel(): void {
    this.isPropertiesCollapsed = !this.isPropertiesCollapsed;
    this.cdr.detectChanges();
  }

  deleteEdge(edge: MoveStatusTransition): void {
    this.transitions = this.transitions.filter(t => t !== edge);
    if (this.selectedEdge === edge) {
      this.selectedEdge = null;
    }
    this.toastService.showSuccess('Transition deleted locally. Click Save to apply.');
    this.cdr.detectChanges();
  }

  saveEdgeChanges(): void {
    // Due to two-way data-binding, properties are updated directly in memory.
    // We trigger change detection to keep drawing references updated.
    this.cdr.detectChanges();
  }

  // --- Document Event Listeners (Global mouse drag/connecting handlers) ---
  onCanvasMouseDown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('canvas-background') || target.classList.contains('canvas-grid')) {
      if (this.isConnecting) {
        this.isConnecting = false;
        this.isClickConnecting = false;
        this.sourceNode = null;
        this.toastService.showInfo('Connection cancelled.');
        this.cdr.detectChanges();
        return;
      }
      this.isPanning = true;
      this.panStartX = event.clientX - this.panX;
      this.panStartY = event.clientY - this.panY;
      this.selectedNode = null;
      this.selectedEdge = null;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent): void {
    if (this.isPanning) {
      this.panX = event.clientX - this.panStartX;
      this.panY = event.clientY - this.panStartY;
      this.cdr.detectChanges();
    } else if (this.isDraggingNode && this.draggedNode) {
      const dx = (event.clientX - this.dragStartX) / this.zoomScale;
      const dy = (event.clientY - this.dragStartY) / this.zoomScale;
      this.draggedNode.x = Math.round(this.nodeStartX + dx);
      this.draggedNode.y = Math.round(this.nodeStartY + dy);
      this.cdr.detectChanges();
    } else if (this.isConnecting) {
      const rect = this.canvasContainer.nativeElement.getBoundingClientRect();
      this.connEndX = (event.clientX - rect.left - this.panX) / this.zoomScale;
      this.connEndY = (event.clientY - rect.top - this.panY) / this.zoomScale;
      this.cdr.detectChanges();
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onDocumentMouseUp(event: MouseEvent): void {
    if (this.isPanning) {
      this.isPanning = false;
    }

    if (this.isDraggingNode) {
      this.isDraggingNode = false;
      this.draggedNode = null;
    }

    if (this.isConnecting) {
      // If we are currently in click-to-connect sequential mode, let mouseup events be ignored.
      // Click-to-connect is resolved only when clicking a target node card or clicking the canvas background.
      if (this.isClickConnecting) {
        return;
      }

      const elapsed = Date.now() - this.connStartTime;
      const dist = Math.hypot(event.clientX - this.connStartMouseX, event.clientY - this.connStartMouseY);

      // If they released the mouse quickly and didn't move it much, keep connection mode active (Click-to-connect)
      if (elapsed < 250 && dist < 10) {
        this.isClickConnecting = true;
        this.toastService.showInfo('Click-to-connect mode active: Click a target status node to connect.');
        return;
      }

      this.isConnecting = false;
      
      // Find target node under the current mouseup coordinates (drag-to-connect)
      const targetNode = this.activeNodes.find(node => {
        if (!node.x || !node.y || node.id === this.sourceNode?.id) return false;
        
        return (
          this.connEndX >= node.x &&
          this.connEndX <= node.x + 200 &&
          this.connEndY >= node.y &&
          this.connEndY <= node.y + 80
        );
      });

      if (targetNode && this.sourceNode) {
        this.createNewTransition(this.sourceNode, targetNode);
      } else {
        this.toastService.showInfo('Connection cancelled.');
      }
      this.sourceNode = null;
      this.cdr.detectChanges();
    }
  }

  createNewTransition(fromNode: MoveStatus, toNode: MoveStatus): void {
    const exists = this.transitions.some(t => t.fromStatusId === fromNode.id && t.toStatusId === toNode.id);
    if (!exists) {
      const newTransition: MoveStatusTransition = {
        fromStatusId: fromNode.id,
        toStatusId: toNode.id,
        transitionName: `${fromNode.code} → ${toNode.code}`,
        requiresApproval: false,
        customerVisible: true,
        active: true
      };

      this.transitions.push(newTransition);
      this.selectedEdge = newTransition;
      this.selectedNode = null;
      this.isPropertiesCollapsed = false;
      this.toastService.showSuccess(`Transition created from ${fromNode.name} to ${toNode.name}.`);
      this.cdr.detectChanges();
    } else {
      this.toastService.showWarning('Transition already exists.');
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.isConnecting) {
        this.isConnecting = false;
        this.isClickConnecting = false;
        this.sourceNode = null;
        this.toastService.showInfo('Connection cancelled.');
        this.cdr.detectChanges();
      }
    }
  }

  // --- Save Workflow Action ---
  saveWorkflow(): void {
    this.isSaving = true;
    
    // Map active nodes list to node saving model
    const nodesPayload = this.activeNodes.map(n => ({
      id: n.id,
      x: n.x,
      y: n.y
    }));

    // Transitions map
    const transitionsPayload = this.transitions.map(t => ({
      id: t.id,
      fromStatusId: t.fromStatusId,
      toStatusId: t.toStatusId,
      transitionName: t.transitionName,
      allowedRoleId: t.allowedRoleId,
      requiresApproval: t.requiresApproval,
      customerVisible: t.customerVisible,
      active: t.active
    }));

    const payload = {
      nodes: nodesPayload,
      transitions: transitionsPayload
    };

    this.workflowService.saveWorkflow(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastService.showSuccess('Workflow designer coordinates and states saved successfully.');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to save workflow', err);
        this.toastService.showError('Failed to save workflow designer layout.');
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Helper to get role name from ID
  getRoleName(roleId?: string): string {
    if (!roleId) return 'All Roles';
    const role = this.roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown Role';
  }
}
