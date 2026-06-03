import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingListPage } from './pages/booking-list.page';
import { BookingDetailPage } from './pages/booking-detail/booking-detail.page';

const routes: Routes = [
  { path: '', component: BookingListPage },
  { path: ':id', component: BookingDetailPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingsRoutingModule {}

