import { Component, OnInit } from '@angular/core';
import { Quote } from '../models/quote.model';
import { QuotesService } from '../services/quotes.service';

@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.page.html',
  styleUrls: ['./quote-list.page.css']
})
export class QuoteListPage implements OnInit {
  quotes: Quote[] = [];

  constructor(private quotesService: QuotesService) {}

  ngOnInit(): void {
    this.quotesService.getQuotes().subscribe(items => this.quotes = items);
  }
}
