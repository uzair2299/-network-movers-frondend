import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuotesRoutingModule } from './quotes-routing.module';
import { QuoteListPage } from './pages/quote-list.page';

@NgModule({
  declarations: [QuoteListPage],
  imports: [CommonModule, RouterModule, QuotesRoutingModule]
})
export class QuotesModule {}
