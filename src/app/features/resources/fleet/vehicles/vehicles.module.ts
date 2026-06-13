import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule } from './vehicles-routing.module';


import { SharedModule } from '../../../../shared/shared.module';
import { VehiclesListPage } from './pages/vehicles-list.page';
import { VehicleDialogComponent } from './dialogs/vehicle-dialog/vehicle-dialog.component';
import { VehicleDetailsPage } from './pages/vehicle-details/vehicle-details.page';

@NgModule({
  declarations: [
    VehiclesListPage,
    VehicleDialogComponent,
    VehicleDetailsPage
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
    SharedModule
  ]
})
export class VehiclesModule { }
