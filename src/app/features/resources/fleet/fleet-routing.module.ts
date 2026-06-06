import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'vehicles', loadChildren: () => import('./vehicles/vehicles.module').then(m => m.VehiclesModule) },
  { path: 'vehicle-makes', loadChildren: () => import('./vehicle-makes/vehicle-makes.module').then(m => m.VehicleMakesModule) },
  { path: 'vehicle-types', loadChildren: () => import('./vehicle-types/vehicle-types.module').then(m => m.VehicleTypesModule) },
  { path: 'vehicle-models', loadChildren: () => import('./vehicle-models/vehicle-models.module').then(m => m.VehicleModelsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetRoutingModule { }
