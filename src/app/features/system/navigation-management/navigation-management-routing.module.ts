import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavigationListPage } from './pages/navigation-list.page';

const routes: Routes = [
  {
    path: '',
    component: NavigationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationManagementRoutingModule {}
