import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DocumentType } from '../models/document-type.model';
import { DocumentTypesService } from '../services/document-types.service';
import { TableColumn } from '../../../../shared/components/dynamic-table/dynamic-table.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DocumentTypeDialogComponent } from '../dialogs/document-type-dialog/document-type-dialog.component';
import { DocumentTypeDetailDialogComponent } from '../dialogs/document-type-detail-dialog/document-type-detail-dialog.component';

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
  sortColumn: string = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchQuery = '';
  
  get sort(): string {
    return `${this.sortColumn},${this.sortDirection}`;
  }
  
  moreActions = [
    { id: 'export', label: 'Export Document Types' },
    { id: 'import', label: 'Import Document Types' }
  ];

  documentActions = [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Document Type' },
    { id: 'delete', label: 'Delete Document Type' }
  ];

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text', sortable: true, bold: true },
    { key: 'code', label: 'Code', type: 'text', sortable: true },
    { key: 'description', label: 'Description', type: 'text', sortable: true },
    { key: 'mandatory', label: 'Mandatory', type: 'boolean', sortable: true },
    { key: 'expiryRequired', label: 'Expiry Required', type: 'boolean', sortable: true },
    { key: 'active', label: 'Status', type: 'status', sortable: true },
    { 
      key: 'actions', 
      label: '', 
      type: 'actions', 
      actionsDropdown: true,
      dropdownItems: this.documentActions
    }
  ];

  constructor(
    private documentTypesService: DocumentTypesService, 
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

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
    const dialogRef = this.dialog.open(DocumentTypeDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { isEdit: false },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: DocumentType | null) => {
      if (result) {
        this.isLoading = true;
        this.documentTypesService.createDocumentType(result).subscribe({
          next: () => {
            this.toastService.showSuccess('Document Type created successfully.', 'Success');
            this.loadDocumentTypes();
          },
          error: (err) => {
            console.error('Error creating document type', err);
            this.error = 'Failed to create document type.';
            this.isLoading = false;
          }
        });
      }
    });
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handleDocumentAction(actionId: string, docType: DocumentType): void {
    if (actionId === 'edit') {
      this.editDocumentType(docType);
    } else if (actionId === 'view') {
      this.viewDocumentType(docType);
    } else if (actionId === 'delete') {
      this.deleteDocumentType(docType);
    } else {
      console.log('Document action clicked:', actionId, 'for document type:', docType.code);
    }
  }

  handleTableAction(event: { action: string, item: DocumentType }): void {
    this.handleDocumentAction(event.action, event.item);
  }

  deleteDocumentType(docType: DocumentType): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Delete Document Type',
        message: `Are you sure you want to delete the document type "${docType.name}"? This action will deactivate it.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = true;
        this.documentTypesService.deleteDocumentType(docType.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Document Type deleted successfully.', 'Success');
            this.loadDocumentTypes();
          },
          error: (err) => {
            console.error('Error deleting document type', err);
            this.toastService.showError('Failed to delete document type.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  viewDocumentType(docType: DocumentType): void {
    this.isLoading = true;
    this.documentTypesService.getDocumentTypeById(docType.id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (fullDocType) => {
        this.dialog.open(DocumentTypeDetailDialogComponent, {
          width: '600px',
          maxWidth: '95vw',
          disableClose: false,
          hasBackdrop: true,
          data: { documentType: fullDocType },
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });
      },
      error: (err) => {
        console.error('Error fetching document type details', err);
        this.toastService.showError('Failed to load document type details.', 'Error');
      }
    });
  }

  editDocumentType(docType: DocumentType): void {
    const dialogRef = this.dialog.open(DocumentTypeDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { documentType: docType, isEdit: true },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: DocumentType | null) => {
      if (result) {
        this.isLoading = true;
        this.documentTypesService.updateDocumentType(docType.id, result).subscribe({
          next: () => {
            this.toastService.showSuccess('Document Type updated successfully.', 'Success');
            this.loadDocumentTypes();
          },
          error: (err) => {
            console.error('Error updating document type', err);
            this.error = 'Failed to update document type.';
            this.isLoading = false;
          }
        });
      }
    });
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 0;
    this.loadDocumentTypes();
  }
}
