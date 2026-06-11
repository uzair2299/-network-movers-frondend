import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking, PaginatedResponse } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private baseUrl = 'https://network-movers-backend-production.up.railway.app/api/v1/admin';

  constructor(private http: HttpClient) {}

  getBookings(page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Observable<PaginatedResponse<Booking>> {
    const url = `${this.baseUrl}/booking?page=${page}&size=${size}&sort=${sort}`;
    return this.http.get<PaginatedResponse<Booking>>(url);
  }

  getBookingById(id: number | string): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/booking/${id}`);
  }

  createBooking(booking: any): Observable<Booking> {
    return this.http.post<Booking>(`${this.baseUrl}/booking`, booking);
  }

  getBookingTimeline(bookingId: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/booking/${bookingId}/timeline`);
  }
}
