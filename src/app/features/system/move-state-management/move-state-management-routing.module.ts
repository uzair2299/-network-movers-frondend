import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoveStateListPage } from './pages/move-state-list/move-state-list.page';

const routes: Routes = [
  {
    path: '',
    component: MoveStateListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoveStateManagementRoutingModule {}
