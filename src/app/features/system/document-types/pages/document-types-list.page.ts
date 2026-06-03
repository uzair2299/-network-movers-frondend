import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DocumentType } from '../models/document-type.model';
import { DocumentTypesService } from '../services/document-types.service';

@Component({
  selector: 'app-document-types-list',
  templateUrl: './document-types-list.page.html',
  styleUrls: ['./document-types-list.page.css']
})
export class DocumentTypesListPage implements OnInit {
  documentTypes: DocumentType[] = [];
  isLoading = false;
  error: string | null = null;
  
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  sort = 'createdAt,desc';
  searchQuery = '';
  
  moreActions = [
    { id: 'export', label: 'Export Document Types' },
    { id: 'import', label: 'Import Document Types' }
  ];

  documentActions = [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Document Type' }
  ];

  constructor(private documentTypesService: DocumentTypesService, private router: Router) {}

  ngOnInit(): void {
    this.loadDocumentTypes();
  }

  loadDocumentTypes(): void {
    this.isLoading = true;
    this.error = null;
    this.documentTypesService.getDocumentTypes(this.currentPage, this.pageSize, this.sort)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.documentTypes = response.content;
          this.totalElements = response.totalElements;
        },
        error: (err) => {
          console.error('Error fetching document types', err);
          this.error = 'Failed to load document types. Please try again later.';
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDocumentTypes();
  }

  onSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadDocumentTypes();
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 0;
    this.loadDocumentTypes();
  }

  createNewDocumentType(): void {
    console.log('Create new document type clicked');
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handleDocumentAction(actionId: string, docType: DocumentType): void {
    console.log('Document action clicked:', actionId, 'for document type:', docType.code);
  }
}
