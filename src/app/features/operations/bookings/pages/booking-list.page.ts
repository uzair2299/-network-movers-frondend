import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Booking } from '../models/booking.model';
import { BookingsService } from '../services/bookings.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.page.html',
  styleUrls: ['./booking-list.page.css']
})
export class BookingListPage implements OnInit {
  bookings: Booking[] = [];
  isLoading = false;
  searchQuery = '';
  
  // Pagination and sorting
  page = 0;
  size = 20;
  totalElements = 0;
  sortColumn = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private bookingsService: BookingsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    const sortParam = `${this.sortColumn},${this.sortDirection}`;
    this.bookingsService.getBookings(this.page, this.size, sortParam).subscribe({
      next: (response) => {
        this.bookings = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings', error);
        this.isLoading = false;
      }
    });
  }

  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadBookings();
  }

  getFilteredBookings(): Booking[] {
    if (!this.searchQuery) return this.bookings;
    
    const query = this.searchQuery.toLowerCase();
    return this.bookings.filter(b => 
      b.name?.toLowerCase().includes(query) || 
      b.user?.first_name?.toLowerCase().includes(query) ||
      b.user?.last_name?.toLowerCase().includes(query) ||
      b.current_status?.name?.toLowerCase().includes(query)
    );
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadBookings();
  }

  onSizeChange(size: number): void {
    this.size = size;
    this.page = 0; // Reset to first page when changing size
    this.loadBookings();
  }

  viewBookingDetails(booking: Booking): void {
    this.router.navigate(['/operations/bookings', booking.id]);
  }
}
