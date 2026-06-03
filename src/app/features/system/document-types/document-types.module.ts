import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DocumentTypesRoutingModule } from './document-types-routing.module';
import { DocumentTypesListPage } from './pages/document-types-list.page';

@NgModule({
  declarations: [DocumentTypesListPage],
  imports: [CommonModule, SharedModule, DocumentTypesRoutingModule]
})
export class DocumentTypesModule {}
