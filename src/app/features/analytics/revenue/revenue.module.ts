import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RevenueRoutingModule } from './revenue-routing.module';
import { RevenueDashboardPage } from './pages/revenue-dashboard.page';

@NgModule({
  declarations: [RevenueDashboardPage],
  imports: [CommonModule, RouterModule, RevenueRoutingModule]
})
export class RevenueModule {}
