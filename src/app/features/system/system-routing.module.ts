import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'navigation',
    loadChildren: () => import('./navigation-management/navigation-management.module').then(m => m.NavigationManagementModule)
  },
  {
    path: 'move-states',
    loadChildren: () => import('./move-state-management/move-state-management.module').then(m => m.MoveStateManagementModule)
  },
  {
    path: 'property-types',
    loadChildren: () => import('./property-management/property-management.module').then(m => m.PropertyManagementModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule {}
