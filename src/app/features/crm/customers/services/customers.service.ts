import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  getCustomers(): Observable<Customer[]> {
    const sample: Customer[] = [
      { id: 'C-1001', name: 'Phil Logistics', email: 'contact@phillogistics.com', joinDate: new Date('2024-01-15') },
      { id: 'C-1002', name: 'Everest Storage', email: 'info@evereststore.com', joinDate: new Date('2024-03-22') }
    ];
    return of(sample);
  }
}
