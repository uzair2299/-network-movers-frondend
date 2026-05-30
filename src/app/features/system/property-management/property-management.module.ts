import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { PropertyManagementRoutingModule } from './property-management-routing.module';
import { PropertyConfigPage } from './pages/property-config/property-config.page';
import { GenericLookupDialogComponent } from './dialogs/generic-lookup-dialog/generic-lookup-dialog.component';
import { PropertyTypeDialogComponent } from './dialogs/property-type-dialog/property-type-dialog.component';
import { PropertySizeDialogComponent } from './dialogs/property-size-dialog/property-size-dialog.component';

@NgModule({
  declarations: [
    PropertyConfigPage,
    GenericLookupDialogComponent,
    PropertyTypeDialogComponent,
    PropertySizeDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PropertyManagementRoutingModule
  ]
})
export class PropertyManagementModule {}
