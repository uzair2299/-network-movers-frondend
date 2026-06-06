import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VehicleModelsListPage } from './pages/vehicle-models-list.page';

const routes: Routes = [
  { path: '', component: VehicleModelsListPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleModelsRoutingModule { }
