import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SupportTicket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  getTickets(): Observable<SupportTicket[]> {
    return of([
      { id: 'T-1001', subject: 'Delivery delay', customer: 'Acme Corp', status: 'Open' },
      { id: 'T-1002', subject: 'Pricing inquiry', customer: 'Everest Storage', status: 'In progress' }
    ]);
  }
}
