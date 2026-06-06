import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleMakesListPage } from './pages/vehicle-makes-list.page';

const routes: Routes = [
  { path: '', component: VehicleMakesListPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleMakesRoutingModule {}
