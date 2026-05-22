import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerListPage } from './pages/customer-list.page';

@NgModule({
  declarations: [CustomerListPage],
  imports: [CommonModule, RouterModule, CustomersRoutingModule]
})
export class CustomersModule {}
