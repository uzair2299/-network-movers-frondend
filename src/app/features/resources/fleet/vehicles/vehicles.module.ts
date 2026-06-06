import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VehiclesRoutingModule } from './vehicles-routing.module';


import { SharedModule } from '../../../../shared/shared.module';
import { VehiclesListPage } from './pages/vehicles-list.page';
import { VehicleDialogComponent } from './dialogs/vehicle-dialog/vehicle-dialog.component';
import { VehicleDetailDialogComponent } from './dialogs/vehicle-detail-dialog/vehicle-detail-dialog.component';

@NgModule({
  declarations: [
    VehiclesListPage,
    VehicleDialogComponent,
    VehicleDetailDialogComponent
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
    SharedModule
  ]
})
export class VehiclesModule { }
