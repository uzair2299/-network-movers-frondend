import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesListPage } from './pages/roles-list.page';

const routes: Routes = [
  { path: '', component: RolesListPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {}
