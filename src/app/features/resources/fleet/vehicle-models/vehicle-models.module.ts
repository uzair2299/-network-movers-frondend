import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { VehicleModelsRoutingModule } from './vehicle-models-routing.module';
import { VehicleModelsListPage } from './pages/vehicle-models-list.page';
import { VehicleModelDialogComponent } from './dialogs/vehicle-model-dialog/vehicle-model-dialog.component';
import { VehicleModelDetailDialogComponent } from './dialogs/vehicle-model-detail-dialog/vehicle-model-detail-dialog.component';

@NgModule({
  declarations: [
    VehicleModelsListPage,
    VehicleModelDialogComponent,
    VehicleModelDetailDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    VehicleModelsRoutingModule
  ]
})
export class VehicleModelsModule { }
