import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OperationsRoutingModule } from './operations-routing.module';

@NgModule({
  imports: [RouterModule, OperationsRoutingModule]
})
export class OperationsModule {}
