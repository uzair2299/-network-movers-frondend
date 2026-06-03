import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { VehicleTypesRoutingModule } from './vehicle-types-routing.module';
import { VehicleTypesListPage } from './pages/vehicle-types-list.page';

@NgModule({
  declarations: [VehicleTypesListPage],
  imports: [CommonModule, SharedModule, VehicleTypesRoutingModule]
})
export class VehicleTypesModule {}
