import { Component, OnInit } from '@angular/core';
import { Driver } from '../models/driver.model';
import { DriversService } from '../services/drivers.service';

@Component({
  selector: 'app-driver-list',
  templateUrl: './driver-list.page.html',
  styleUrls: ['./driver-list.page.css']
})
export class DriverListPage implements OnInit {
  drivers: Driver[] = [];

  constructor(private driversService: DriversService) {}

  ngOnInit(): void {
    this.driversService.getDrivers().subscribe(data => {
      this.drivers = data;
    });
  }
}
