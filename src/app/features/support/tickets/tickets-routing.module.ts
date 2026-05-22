import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketListPage } from './pages/ticket-list.page';

const routes: Routes = [
  { path: '', component: TicketListPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule {}
