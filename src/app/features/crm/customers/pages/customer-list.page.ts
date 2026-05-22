import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer.model';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.page.html',
  styleUrls: ['./customer-list.page.css']
})
export class CustomerListPage implements OnInit {
  customers: Customer[] = [];

  constructor(private customersService: CustomersService) {}

  ngOnInit(): void {
    this.customersService.getCustomers().subscribe(result => {
      this.customers = result;
    });
  }
}
