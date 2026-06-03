import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingListPage } from './pages/booking-list.page';
import { BookingDetailPage } from './pages/booking-detail/booking-detail.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    BookingListPage,
    BookingDetailPage
  ],
  imports: [CommonModule, RouterModule, BookingsRoutingModule, SharedModule]
})
export class BookingsModule {}

