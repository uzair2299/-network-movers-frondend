import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListPage } from './pages/users-list.page';
import { AssignRolesPage } from './pages/assign-roles/assign-roles.page';

const routes: Routes = [
  { path: '', component: UsersListPage },
  { path: ':id/assign-roles', component: AssignRolesPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
