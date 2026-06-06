import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { VehicleTypesRoutingModule } from './vehicle-types-routing.module';
import { VehicleTypesListPage } from './pages/vehicle-types-list.page';
import { VehicleTypeDialogComponent } from './dialogs/vehicle-type-dialog/vehicle-type-dialog.component';
import { VehicleTypeDetailDialogComponent } from './dialogs/vehicle-type-detail-dialog/vehicle-type-detail-dialog.component';

@NgModule({
  declarations: [
    VehicleTypesListPage,
    VehicleTypeDialogComponent,
    VehicleTypeDetailDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    VehicleTypesRoutingModule
  ]
})
export class VehicleTypesModule {}
