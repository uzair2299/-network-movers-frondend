import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  getBookings(): Observable<Booking[]> {
    const sample: Booking[] = [
      { id: 'BKG-1001', reference: 'NM-1001', customerName: 'Acme Corp', requestedDate: new Date() },
      { id: 'BKG-1002', reference: 'NM-1002', customerName: 'Blue Transport', requestedDate: new Date() }
    ];

    return of(sample);
  }
}
