import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from '../../models/booking.model';
import { BookingsService } from '../../services/bookings.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.css']
})
export class BookingDetailPage implements OnInit {
  booking: Booking | null = null;
  timeline: any[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingsService: BookingsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadBooking(id);
      } else {
        this.goBack();
      }
    });
  }

  loadBooking(id: string): void {
    this.isLoading = true;
    this.bookingsService.getBookingById(id).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.bookingsService.getBookingTimeline(id).subscribe({
          next: (timeline) => {
            this.timeline = timeline;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading booking timeline', err);
            this.timeline = [];
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading booking details', error);
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/operations/bookings']);
  }
}
