import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DocumentTypesRoutingModule } from './document-types-routing.module';
import { DocumentTypesListPage } from './pages/document-types-list.page';

import { DocumentTypeDialogComponent } from './dialogs/document-type-dialog/document-type-dialog.component';
import { DocumentTypeDetailDialogComponent } from './dialogs/document-type-detail-dialog/document-type-detail-dialog.component';

@NgModule({
  declarations: [
    DocumentTypesListPage,
    DocumentTypeDialogComponent,
    DocumentTypeDetailDialogComponent
  ],
  imports: [CommonModule, SharedModule, DocumentTypesRoutingModule]
})
export class DocumentTypesModule {}
