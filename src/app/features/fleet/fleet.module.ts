import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FleetRoutingModule } from './fleet-routing.module';

@NgModule({
  imports: [RouterModule, FleetRoutingModule]
})
export class FleetModule {}
