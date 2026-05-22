import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DriversRoutingModule } from './drivers-routing.module';
import { DriverListPage } from './pages/driver-list.page';

@NgModule({
  declarations: [DriverListPage],
  imports: [CommonModule, RouterModule, DriversRoutingModule]
})
export class DriversModule {}
