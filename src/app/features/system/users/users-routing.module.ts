import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListPage } from './pages/users-list.page';
import { AssignRolesPage } from './pages/assign-roles/assign-roles.page';
import { UserDetailPage } from './pages/user-detail/user-detail.page';

const routes: Routes = [
  { path: '', component: UsersListPage },
  { path: ':id/assign-roles', component: AssignRolesPage },
  { path: ':id', component: UserDetailPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
