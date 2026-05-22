import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersRoutingModule } from './users-routing.module';
import { UsersListPage } from './pages/users-list.page';

@NgModule({
  declarations: [UsersListPage],
  imports: [CommonModule, RouterModule, UsersRoutingModule]
})
export class UsersModule {}
