import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevenueDashboardPage } from './pages/revenue-dashboard.page';

const routes: Routes = [
  { path: '', component: RevenueDashboardPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RevenueRoutingModule {}
