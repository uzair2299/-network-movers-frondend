import { Component, OnInit } from '@angular/core';
import { RevenueMetric } from '../models/revenue-metric.model';
import { RevenueService } from '../services/revenue.service';

@Component({
  selector: 'app-revenue-dashboard',
  templateUrl: './revenue-dashboard.page.html',
  styleUrls: ['./revenue-dashboard.page.css']
})
export class RevenueDashboardPage implements OnInit {
  metrics: RevenueMetric[] = [];

  constructor(private revenueService: RevenueService) {}

  ngOnInit(): void {
    this.revenueService.getRevenueMetrics().subscribe(data => this.metrics = data);
  }
}
