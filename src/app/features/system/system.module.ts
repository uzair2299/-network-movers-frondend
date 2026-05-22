import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SystemRoutingModule } from './system-routing.module';

@NgModule({
  imports: [RouterModule, SystemRoutingModule]
})
export class SystemModule {}
