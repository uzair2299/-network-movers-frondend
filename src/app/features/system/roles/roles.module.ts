import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesListPage } from './pages/roles-list.page';
import { RoleDialogComponent } from './dialogs/role-dialog/role-dialog.component';
import { RoleDetailDialogComponent } from './dialogs/role-detail-dialog/role-detail-dialog.component';

@NgModule({
  declarations: [
    RolesListPage,
    RoleDialogComponent,
    RoleDetailDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RolesRoutingModule
  ]
})
export class RolesModule {}
