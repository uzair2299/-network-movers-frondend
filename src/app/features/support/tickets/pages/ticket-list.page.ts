import { Component, OnInit } from '@angular/core';
import { SupportTicket } from '../models/ticket.model';
import { TicketsService } from '../services/tickets.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.page.html',
  styleUrls: ['./ticket-list.page.css']
})
export class TicketListPage implements OnInit {
  tickets: SupportTicket[] = [];

  constructor(private ticketsService: TicketsService) {}

  ngOnInit(): void {
    this.ticketsService.getTickets().subscribe(data => this.tickets = data);
  }
}
