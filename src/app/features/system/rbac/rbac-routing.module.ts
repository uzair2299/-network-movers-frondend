import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulesListPage } from './pages/modules/modules-list.page';
import { ResourcesListPage } from './pages/resources/resources-list.page';
import { PermissionsListPage } from './pages/permissions/permissions-list.page';
import { RolesListPage } from './pages/roles/roles-list.page';
import { UserRolesListPage } from './pages/user-roles/user-roles-list.page';
import { RolePermissionsListPage } from './pages/role-permissions/role-permissions-list.page';
import { RolePermissionAssignPage } from './pages/role-permissions/role-permission-assign.page';

const routes: Routes = [
  {
    path: 'modules',
    component: ModulesListPage
  },
  {
    path: 'resources',
    component: ResourcesListPage
  },
  {
    path: 'permissions',
    component: PermissionsListPage
  },
  {
    path: 'roles',
    component: RolesListPage
  },
  {
    path: 'role-permissions',
    component: RolePermissionsListPage
  },
  {
    path: 'role-permissions/assign',
    component: RolePermissionAssignPage
  },
  {
    path: 'user-roles',
    component: UserRolesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RbacRoutingModule {}
