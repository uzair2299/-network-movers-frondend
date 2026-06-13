import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MoveStatus, MoveStatusTransition } from '../models/workflow-designer.model';

@Injectable({
  providedIn: 'root'
})
export class WorkflowDesignerService {
  private STORAGE_KEY = 'move_workflow_designer_state';

  private defaultWorkflow = {
    nodes: [
      { id: 'fd9a693a-ba36-4054-859a-ab739783d170', x: 100, y: 150 },
      { id: '4660f8f9-5e66-4e9d-bc43-5f673bb22433', x: 360, y: 150 },
      { id: 'd9a1bbfa-0f8b-4602-8dc9-691c2dcdde3f', x: 620, y: 150 },
      { id: '2eca3410-2fbe-417c-9bbb-a45ea149ab39', x: 880, y: 150 },
      { id: '91d86eba-584d-411a-9e52-b1874aedb0bb', x: 1140, y: 150 },
      { id: 'e86ce797-f8e8-4ac0-8896-eb5b5cb59baa', x: 1400, y: 150 }
    ],
    transitions: [
      {
        id: 't1',
        fromStatusId: 'fd9a693a-ba36-4054-859a-ab739783d170',
        toStatusId: '4660f8f9-5e66-4e9d-bc43-5f673bb22433',
        transitionName: 'Start Review',
        requiresApproval: false,
        customerVisible: true,
        active: true
      },
      {
        id: 't2',
        fromStatusId: '4660f8f9-5e66-4e9d-bc43-5f673bb22433',
        toStatusId: 'd9a1bbfa-0f8b-4602-8dc9-691c2dcdde3f',
        transitionName: 'Prepare Quote',
        requiresApproval: false,
        customerVisible: true,
        active: true
      },
      {
        id: 't3',
        fromStatusId: 'd9a1bbfa-0f8b-4602-8dc9-691c2dcdde3f',
        toStatusId: '2eca3410-2fbe-417c-9bbb-a45ea149ab39',
        transitionName: 'Send Quote',
        requiresApproval: false,
        customerVisible: true,
        active: true
      },
      {
        id: 't4',
        fromStatusId: '2eca3410-2fbe-417c-9bbb-a45ea149ab39',
        toStatusId: '91d86eba-584d-411a-9e52-b1874aedb0bb',
        transitionName: 'Approve Quote',
        requiresApproval: true,
        customerVisible: true,
        active: true
      },
      {
        id: 't5',
        fromStatusId: '91d86eba-584d-411a-9e52-b1874aedb0bb',
        toStatusId: 'e86ce797-f8e8-4ac0-8896-eb5b5cb59baa',
        transitionName: 'Confirm Booking',
        requiresApproval: false,
        customerVisible: true,
        active: true
      }
    ]
  };

  constructor() {}

  getWorkflow(): Observable<{ nodes: any[]; transitions: MoveStatusTransition[] }> {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        return of({
          nodes: parsed.nodes || [],
          transitions: parsed.transitions || []
        });
      } catch (e) {
        console.error('Failed to parse workflow designer state from localStorage', e);
      }
    }
    // Return default pre-configured sequence on first load
    return of({
      nodes: [...this.defaultWorkflow.nodes],
      transitions: [...this.defaultWorkflow.transitions]
    });
  }

  saveWorkflow(payload: { nodes: any[]; transitions: any[] }): Observable<any> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
    return of({ success: true });
  }

  createTransition(payload: Partial<MoveStatusTransition>): Observable<MoveStatusTransition> {
    const newTransition: MoveStatusTransition = {
      id: payload.id || Math.random().toString(36).substring(2, 9),
      fromStatusId: payload.fromStatusId!,
      toStatusId: payload.toStatusId!,
      transitionName: payload.transitionName || '',
      allowedRoleId: payload.allowedRoleId,
      requiresApproval: payload.requiresApproval || false,
      customerVisible: payload.customerVisible ?? true,
      active: payload.active ?? true
    };
    return of(newTransition);
  }

  deleteTransition(id: string): Observable<void> {
    return of(undefined);
  }
}
