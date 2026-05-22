import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Quote } from '../models/quote.model';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {
  getQuotes(): Observable<Quote[]> {
    return of([
      { id: 'Q-1001', reference: 'QUOTE-01', customer: 'Acme Corp', total: 1785.50 },
      { id: 'Q-1002', reference: 'QUOTE-02', customer: 'Blue Transport', total: 2340.00 }
    ]);
  }
}
