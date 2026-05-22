import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DriverListPage } from './pages/driver-list.page';

const routes: Routes = [
  { path: '', component: DriverListPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriversRoutingModule {}
