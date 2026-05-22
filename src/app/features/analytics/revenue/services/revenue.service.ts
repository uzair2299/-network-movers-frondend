import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RevenueMetric } from '../models/revenue-metric.model';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
  getRevenueMetrics(): Observable<RevenueMetric[]> {
    return of([
      { label: 'Monthly Revenue', value: '$132,400', change: '+9%' },
      { label: 'Gross Margin', value: '28.6%', change: '+1.4%' }
    ]);
  }
}
