import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingsRoutingModule } from './bookings-routing.module';
import { BookingListPage } from './pages/booking-list.page';

@NgModule({
  declarations: [BookingListPage],
  imports: [CommonModule, RouterModule, BookingsRoutingModule]
})
export class BookingsModule {}
