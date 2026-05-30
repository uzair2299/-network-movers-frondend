import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';

import { NavigationManagementRoutingModule } from './navigation-management-routing.module';
import { NavigationListPage } from './pages/navigation-list.page';
import { NavigationItemDialogComponent } from './dialogs/navigation-item-dialog.component';
import { NavigationManagementService } from './services/navigation-management.service';
import { NavigationPermissionService } from './services/navigation-permission.service';

@NgModule({
  declarations: [NavigationListPage, NavigationItemDialogComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    DragDropModule,
    MatDialogModule,
    NavigationManagementRoutingModule
  ],
  providers: [NavigationManagementService, NavigationPermissionService]
})
export class NavigationManagementModule {}

