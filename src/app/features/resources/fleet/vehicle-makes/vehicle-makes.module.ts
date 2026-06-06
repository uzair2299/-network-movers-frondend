import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { VehicleMakesRoutingModule } from './vehicle-makes-routing.module';
import { VehicleMakesListPage } from './pages/vehicle-makes-list.page';
import { VehicleMakeDialogComponent } from './dialogs/vehicle-make-dialog/vehicle-make-dialog.component';
import { VehicleMakeDetailDialogComponent } from './dialogs/vehicle-make-detail-dialog/vehicle-make-detail-dialog.component';

@NgModule({
  declarations: [
    VehicleMakesListPage,
    VehicleMakeDialogComponent,
    VehicleMakeDetailDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    VehicleMakesRoutingModule
  ]
})
export class VehicleMakesModule {}
