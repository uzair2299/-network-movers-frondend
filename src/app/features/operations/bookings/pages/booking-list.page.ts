import { Component, OnInit } from '@angular/core';
import { Booking } from '../models/booking.model';
import { BookingsService } from '../services/bookings.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.page.html',
  styleUrls: ['./booking-list.page.css']
})
export class BookingListPage implements OnInit {
  bookings: Booking[] = [];

  constructor(private bookingsService: BookingsService) {}

  ngOnInit(): void {
    this.bookingsService.getBookings().subscribe(result => {
      this.bookings = result;
    });
  }
}
