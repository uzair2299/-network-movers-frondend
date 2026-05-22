import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketsRoutingModule } from './tickets-routing.module';
import { TicketListPage } from './pages/ticket-list.page';

@NgModule({
  declarations: [TicketListPage],
  imports: [CommonModule, RouterModule, TicketsRoutingModule]
})
export class TicketsModule {}
