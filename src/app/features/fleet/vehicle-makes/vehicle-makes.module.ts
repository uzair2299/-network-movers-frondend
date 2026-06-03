import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { VehicleMakesRoutingModule } from './vehicle-makes-routing.module';
import { VehicleMakesListPage } from './pages/vehicle-makes-list.page';

@NgModule({
  declarations: [VehicleMakesListPage],
  imports: [CommonModule, SharedModule, VehicleMakesRoutingModule]
})
export class VehicleMakesModule {}
