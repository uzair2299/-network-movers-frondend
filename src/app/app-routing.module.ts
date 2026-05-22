import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'operations/bookings',
    pathMatch: 'full'
  },
  {
    path: 'operations',
    loadChildren: () => import('./features/operations/operations.module').then(m => m.OperationsModule)
  },
  {
    path: 'crm',
    loadChildren: () => import('./features/crm/crm.module').then(m => m.CrmModule)
  },
  {
    path: 'fleet',
    loadChildren: () => import('./features/fleet/fleet.module').then(m => m.FleetModule)
  },
  {
    path: 'pricing',
    loadChildren: () => import('./features/pricing/pricing.module').then(m => m.PricingModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./features/support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'analytics',
    loadChildren: () => import('./features/analytics/analytics.module').then(m => m.AnalyticsModule)
  },
  {
    path: 'system',
    loadChildren: () => import('./features/system/system.module').then(m => m.SystemModule)
  }
];
