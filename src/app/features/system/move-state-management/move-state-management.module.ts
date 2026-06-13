import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { MoveStateManagementRoutingModule } from './move-state-management-routing.module';
import { MoveStateListPage } from './pages/move-state-list/move-state-list.page';
import { PhaseDialogComponent } from './dialogs/phase-dialog/phase-dialog.component';
import { StatusDialogComponent } from './dialogs/status-dialog/status-dialog.component';
import { WorkflowDesignerComponent } from './pages/workflow-designer/workflow-designer.component';

@NgModule({
  declarations: [
    MoveStateListPage,
    PhaseDialogComponent,
    StatusDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MoveStateManagementRoutingModule,
    WorkflowDesignerComponent
  ]
})
export class MoveStateManagementModule {}
