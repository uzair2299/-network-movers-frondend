import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersRoutingModule } from './users-routing.module';
import { UsersListPage } from './pages/users-list.page';
import { AssignRolesPage } from './pages/assign-roles/assign-roles.page';
import { UserDialogComponent } from './dialogs/user-dialog/user-dialog.component';
import { UserDetailPage } from './pages/user-detail/user-detail.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [UsersListPage, AssignRolesPage, UserDialogComponent, UserDetailPage],
  imports: [CommonModule, RouterModule, SharedModule, UsersRoutingModule]
})
export class UsersModule {}
