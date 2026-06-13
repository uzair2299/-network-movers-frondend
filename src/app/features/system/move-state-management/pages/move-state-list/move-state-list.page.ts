import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MoveStateService } from '../../services/move-state.service';
import { MovePhaseResponse, MoveStatusResponse } from '../../models/move-state.model';
import { PhaseDialogComponent } from '../../dialogs/phase-dialog/phase-dialog.component';
import { StatusDialogComponent } from '../../dialogs/status-dialog/status-dialog.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-move-state-list',
  templateUrl: './move-state-list.page.html',
  styleUrls: ['./move-state-list.page.css']
})
export class MoveStateListPage implements OnInit {
  activeTab: 'list' | 'designer' = 'list';
  phases: MovePhaseResponse[] = [];
  statuses: MoveStatusResponse[] = [];
  
  selectedPhase: MovePhaseResponse | null = null;
  isLoadingPhases = false;
  isLoadingStatuses = false;

  constructor(
    private moveStateService: MoveStateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPhases();
  }

  // --- PHASES ---

  loadPhases(): void {
    this.isLoadingPhases = true;
    this.moveStateService.getPhases().subscribe(res => {
      this.phases = res;
      this.isLoadingPhases = false;
    });
  }

  selectPhase(phase: MovePhaseResponse): void {
    this.selectedPhase = phase;
    this.loadStatuses(phase.id);
  }

  openPhaseDialog(phase?: MovePhaseResponse): void {
    const dialogRef = this.dialog.open(PhaseDialogComponent, {
      width: '500px',
      data: { phase },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (phase) {
          this.moveStateService.updatePhase(phase.id, result).subscribe(() => this.loadPhases());
        } else {
          this.moveStateService.createPhase(result).subscribe(() => this.loadPhases());
        }
      }
    });
  }

  deletePhase(phase: MovePhaseResponse, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Phase',
        message: `Are you sure you want to delete ${phase.name}? This will also delete all associated statuses.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'warning'
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.moveStateService.deletePhase(phase.id).subscribe(() => {
          if (this.selectedPhase?.id === phase.id) {
            this.selectedPhase = null;
            this.statuses = [];
          }
          this.loadPhases();
        });
      }
    });
  }

  // --- STATUSES ---

  loadStatuses(phaseId: string): void {
    this.isLoadingStatuses = true;
    this.moveStateService.getStatusesByPhaseId(phaseId).subscribe(res => {
      this.statuses = res;
      this.isLoadingStatuses = false;
    });
  }

  openStatusDialog(status?: MoveStatusResponse): void {
    if (!this.selectedPhase) return;

    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: '600px',
      data: { status, phaseId: this.selectedPhase.id },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (status) {
          this.moveStateService.updateStatus(status.id, result).subscribe(() => this.loadStatuses(this.selectedPhase!.id));
        } else {
          this.moveStateService.createStatus(result).subscribe(() => this.loadStatuses(this.selectedPhase!.id));
        }
      }
    });
  }

  deleteStatus(status: MoveStatusResponse, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Status',
        message: `Are you sure you want to delete ${status.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'warning'
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.moveStateService.deleteStatus(status.id).subscribe(() => {
          if (this.selectedPhase) {
            this.loadStatuses(this.selectedPhase.id);
          }
        });
      }
    });
  }
}
