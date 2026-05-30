import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '../../../shared/shared.module';

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
    MatMenuModule,
    SharedModule,
    NavigationManagementRoutingModule
  ],
  providers: [NavigationManagementService, NavigationPermissionService]
})
export class NavigationManagementModule {}

