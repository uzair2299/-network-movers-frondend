import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentTypesListPage } from './pages/document-types-list.page';

const routes: Routes = [
  { path: '', component: DocumentTypesListPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentTypesRoutingModule {}
