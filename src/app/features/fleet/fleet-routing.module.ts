import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'drivers',
    loadChildren: () => import('./drivers/drivers.module').then(m => m.DriversModule)
  },
  { path: 'maintenance', loadChildren: () => import('./maintenance/maintenance.module').then(m => m.MaintenanceModule) },
  { path: 'inspections', loadChildren: () => import('./inspections/inspections.module').then(m => m.InspectionsModule) },
  { path: 'fuel-logs', loadChildren: () => import('./fuel-logs/fuel-logs.module').then(m => m.FuelLogsModule) },
  { path: 'assignments', loadChildren: () => import('./assignments/assignments.module').then(m => m.AssignmentsModule) },
  { path: 'documents', loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule) },
  { path: 'incidents', loadChildren: () => import('./incidents/incidents.module').then(m => m.IncidentsModule) },
  { path: 'tracking', loadChildren: () => import('./tracking/tracking.module').then(m => m.TrackingModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetRoutingModule {}
