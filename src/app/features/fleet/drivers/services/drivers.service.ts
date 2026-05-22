import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root'
})
export class DriversService {
  getDrivers(): Observable<Driver[]> {
    return of([
      { id: 'D-1001', name: 'Marina Lopez', status: 'Available', rating: 4.8 },
      { id: 'D-1002', name: 'Jordan Smith', status: 'On duty', rating: 4.5 }
    ]);
  }
}
