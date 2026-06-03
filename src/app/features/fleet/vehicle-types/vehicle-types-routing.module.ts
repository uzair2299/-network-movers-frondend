import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleTypesListPage } from './pages/vehicle-types-list.page';

const routes: Routes = [
  { path: '', component: VehicleTypesListPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleTypesRoutingModule {}
