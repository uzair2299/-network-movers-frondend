import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CrmRoutingModule } from './crm-routing.module';

@NgModule({
  imports: [RouterModule, CrmRoutingModule]
})
export class CrmModule {}
