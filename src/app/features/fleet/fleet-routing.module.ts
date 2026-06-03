import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'drivers',
    loadChildren: () => import('./drivers/drivers.module').then(m => m.DriversModule)
  },
  {
    path: 'vehicle-types',
    loadChildren: () => import('./vehicle-types/vehicle-types.module').then(m => m.VehicleTypesModule)
  },
  {
    path: 'vehicle-makes',
    loadChildren: () => import('./vehicle-makes/vehicle-makes.module').then(m => m.VehicleMakesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetRoutingModule {}
