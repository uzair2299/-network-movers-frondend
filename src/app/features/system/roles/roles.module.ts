import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesListPage } from './pages/roles-list.page';

@NgModule({
  declarations: [RolesListPage],
  imports: [CommonModule, RouterModule, SharedModule, RolesRoutingModule]
})
export class RolesModule {}
