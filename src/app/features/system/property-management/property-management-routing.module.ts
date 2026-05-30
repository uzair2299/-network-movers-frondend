import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyConfigPage } from './pages/property-config/property-config.page';

const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: ':tab', component: PropertyConfigPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyManagementRoutingModule {}
