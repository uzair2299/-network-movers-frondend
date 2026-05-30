import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { QuickBookPageComponent } from './pages/quick-book/quick-book.page';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'quick-book', component: QuickBookPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
