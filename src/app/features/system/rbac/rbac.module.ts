import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { RbacRoutingModule } from './rbac-routing.module';

// Pages
import { ModulesListPage } from './pages/modules/modules-list.page';
import { ResourcesListPage } from './pages/resources/resources-list.page';
import { PermissionsListPage } from './pages/permissions/permissions-list.page';
import { RolesListPage } from './pages/roles/roles-list.page';
import { UserRolesListPage } from './pages/user-roles/user-roles-list.page';

// Dialogs
import { ModuleDialogComponent } from './dialogs/module-dialog/module-dialog.component';
import { ModuleDetailDialogComponent } from './dialogs/module-detail-dialog/module-detail-dialog.component';
import { ResourceDialogComponent } from './dialogs/resource-dialog/resource-dialog.component';
import { ResourceDetailDialogComponent } from './dialogs/resource-detail-dialog/resource-detail-dialog.component';
import { PermissionDialogComponent } from './dialogs/permission-dialog/permission-dialog.component';
import { PermissionDetailDialogComponent } from './dialogs/permission-detail-dialog/permission-detail-dialog.component';
import { RoleDialogComponent } from './dialogs/role-dialog/role-dialog.component';
import { RoleDetailDialogComponent } from './dialogs/role-detail-dialog/role-detail-dialog.component';
import { UserRoleDialogComponent } from './dialogs/user-role-dialog/user-role-dialog.component';

@NgModule({
  declarations: [
    ModulesListPage,
    ResourcesListPage,
    PermissionsListPage,
    RolesListPage,
    UserRolesListPage,
    ModuleDialogComponent,
    ModuleDetailDialogComponent,
    ResourceDialogComponent,
    ResourceDetailDialogComponent,
    PermissionDialogComponent,
    PermissionDetailDialogComponent,
    RoleDialogComponent,
    RoleDetailDialogComponent,
    UserRoleDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    RbacRoutingModule
  ]
})
export class RbacModule {}
