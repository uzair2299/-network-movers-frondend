import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Resource } from '../../models/rbac.models';
import { RbacService } from '../../services/rbac.service';
import { ResourceDialogComponent } from '../../dialogs/resource-dialog/resource-dialog.component';
import { ResourceDetailDialogComponent } from '../../dialogs/resource-detail-dialog/resource-detail-dialog.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TableColumn } from '../../../../../shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-resources-list',
  templateUrl: './resources-list.page.html',
  styleUrls: ['./resources-list.page.css']
})
export class ResourcesListPage implements OnInit, OnDestroy {
  resources: Resource[] = [];
  isLoading = false;
  error: string | null = null;
  
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  sortColumn: string = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  
  get sort(): string {
    return `${this.sortColumn},${this.sortDirection}`;
  }
  
  moreActions = [
    { id: 'export', label: 'Export Resources' },
    { id: 'import', label: 'Import Resources' }
  ];

  resourceActions = [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Resource' },
    { id: 'delete', label: 'Delete Resource' }
  ];

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text', sortable: true, bold: true },
    { key: 'code', label: 'Code', type: 'text', sortable: true },
    { key: 'description', label: 'Description', type: 'text', sortable: true },
    { key: 'active', label: 'Status', type: 'status', sortable: true },
    { 
      key: 'actions', 
      label: '', 
      type: 'actions', 
      actionsDropdown: true,
      dropdownItems: this.resourceActions
    }
  ];

  constructor(
    private rbacService: RbacService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.currentPage = 0;
      this.loadResources();
    });

    this.loadResources();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadResources(): void {
    this.isLoading = true;
    this.error = null;
    this.rbacService.getResources(this.currentPage, this.pageSize, this.sort, this.searchQuery)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.resources = response.content;
          this.totalElements = response.totalElements;
        },
        error: (err) => {
          console.error('Error fetching resources', err);
          this.error = 'Failed to load resources. Please try again later.';
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadResources();
  }

  onSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadResources();
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  createNewResource(): void {
    const dialogRef = this.dialog.open(ResourceDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { isEdit: false },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: Resource | null) => {
      if (result) {
        this.isLoading = true;
        this.rbacService.createResource(result).subscribe({
          next: () => {
            this.toastService.showSuccess('Resource created successfully.', 'Success');
            this.loadResources();
          },
          error: (err) => {
            console.error('Error creating resource', err);
            this.toastService.showError('Failed to create resource.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handleResourceAction(actionId: string, resource: Resource): void {
    if (actionId === 'edit') {
      this.editResource(resource);
    } else if (actionId === 'view') {
      this.viewResource(resource);
    } else if (actionId === 'delete') {
      this.deleteResource(resource);
    } else {
      console.log('Resource action clicked:', actionId, 'for resource:', resource.code);
    }
  }

  handleTableAction(event: { action: string, item: Resource }): void {
    this.handleResourceAction(event.action, event.item);
  }

  deleteResource(resource: Resource): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Delete Resource',
        message: `Are you sure you want to delete the resource "${resource.name}"? This action will deactivate it.`,
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
        this.rbacService.deleteResource(resource.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Resource deleted successfully.', 'Success');
            this.loadResources();
          },
          error: (err) => {
            console.error('Error deleting resource', err);
            this.toastService.showError('Failed to delete resource.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  viewResource(resource: Resource): void {
    this.isLoading = true;
    this.rbacService.getResourceById(resource.id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (fullResource) => {
        this.dialog.open(ResourceDetailDialogComponent, {
          width: '600px',
          maxWidth: '95vw',
          disableClose: false,
          hasBackdrop: true,
          data: { resource: fullResource },
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });
      },
      error: (err) => {
        console.error('Error fetching resource details', err);
        this.toastService.showError('Failed to load resource details.', 'Error');
      }
    });
  }

  editResource(resource: Resource): void {
    const dialogRef = this.dialog.open(ResourceDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { resource, isEdit: true },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: Resource | null) => {
      if (result) {
        this.isLoading = true;
        this.rbacService.updateResource(resource.id, result).subscribe({
          next: () => {
            this.toastService.showSuccess('Resource updated successfully.', 'Success');
            this.loadResources();
          },
          error: (err) => {
            console.error('Error updating resource', err);
            this.toastService.showError('Failed to update resource.', 'Error');
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
    this.loadResources();
  }
}
