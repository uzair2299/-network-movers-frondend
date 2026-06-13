import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VehiclesListPage } from './pages/vehicles-list.page';

import { VehicleDetailsPage } from './pages/vehicle-details/vehicle-details.page';

const routes: Routes = [
  { path: '', component: VehiclesListPage },
  { path: ':id', component: VehicleDetailsPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclesRoutingModule { }
