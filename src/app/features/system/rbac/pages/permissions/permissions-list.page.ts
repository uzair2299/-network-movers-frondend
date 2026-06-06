import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Permission } from '../../models/rbac.models';
import { RbacService } from '../../services/rbac.service';
import { PermissionDialogComponent } from '../../dialogs/permission-dialog/permission-dialog.component';
import { PermissionDetailDialogComponent } from '../../dialogs/permission-detail-dialog/permission-detail-dialog.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TableColumn } from '../../../../../shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-permissions-list',
  templateUrl: './permissions-list.page.html',
  styleUrls: ['./permissions-list.page.css']
})
export class PermissionsListPage implements OnInit, OnDestroy {
  permissions: Permission[] = [];
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
    { id: 'export', label: 'Export Permissions' },
    { id: 'import', label: 'Import Permissions' }
  ];

  permissionActions = [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Permission' },
    { id: 'delete', label: 'Delete Permission' }
  ];

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text', sortable: true, bold: true },
    { key: 'code', label: 'Code', type: 'text', sortable: true },
    { key: 'resourceName', label: 'Resource', type: 'text', sortable: false },
    { key: 'description', label: 'Description', type: 'text', sortable: true },
    { key: 'active', label: 'Status', type: 'status', sortable: true },
    { 
      key: 'actions', 
      label: '', 
      type: 'actions', 
      actionsDropdown: true,
      dropdownItems: this.permissionActions
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
      this.loadPermissions();
    });

    this.loadPermissions();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadPermissions(): void {
    this.isLoading = true;
    this.error = null;
    this.rbacService.getPermissions(this.currentPage, this.pageSize, this.sort, this.searchQuery)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.permissions = response.content;
          this.totalElements = response.totalElements;
        },
        error: (err) => {
          console.error('Error fetching permissions', err);
          this.error = 'Failed to load permissions. Please try again later.';
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPermissions();
  }

  onSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadPermissions();
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  createNewPermission(): void {
    const dialogRef = this.dialog.open(PermissionDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { isEdit: false },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: Permission | null) => {
      if (result) {
        this.isLoading = true;
        this.rbacService.createPermission(result).subscribe({
          next: () => {
            this.toastService.showSuccess('Permission created successfully.', 'Success');
            this.loadPermissions();
          },
          error: (err) => {
            console.error('Error creating permission', err);
            this.toastService.showError('Failed to create permission.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handlePermissionAction(actionId: string, permission: Permission): void {
    if (actionId === 'edit') {
      this.editPermission(permission);
    } else if (actionId === 'view') {
      this.viewPermission(permission);
    } else if (actionId === 'delete') {
      this.deletePermission(permission);
    } else {
      console.log('Permission action clicked:', actionId, 'for permission:', permission.code);
    }
  }

  handleTableAction(event: { action: string, item: Permission }): void {
    this.handlePermissionAction(event.action, event.item);
  }

  deletePermission(permission: Permission): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Delete Permission',
        message: `Are you sure you want to delete the permission "${permission.name}"? This action will deactivate it.`,
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
        this.rbacService.deletePermission(permission.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Permission deleted successfully.', 'Success');
            this.loadPermissions();
          },
          error: (err) => {
            console.error('Error deleting permission', err);
            this.toastService.showError('Failed to delete permission.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  viewPermission(permission: Permission): void {
    this.isLoading = true;
    this.rbacService.getPermissionById(permission.id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (fullPermission) => {
        this.dialog.open(PermissionDetailDialogComponent, {
          width: '600px',
          maxWidth: '95vw',
          disableClose: false,
          hasBackdrop: true,
          data: { permission: fullPermission },
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });
      },
      error: (err) => {
        console.error('Error fetching permission details', err);
        this.toastService.showError('Failed to load permission details.', 'Error');
      }
    });
  }

  editPermission(permission: Permission): void {
    const dialogRef = this.dialog.open(PermissionDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { permission, isEdit: true },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: Permission | null) => {
      if (result) {
        this.isLoading = true;
        this.rbacService.updatePermission(permission.id, result).subscribe({
          next: () => {
            this.toastService.showSuccess('Permission updated successfully.', 'Success');
            this.loadPermissions();
          },
          error: (err) => {
            console.error('Error updating permission', err);
            this.toastService.showError('Failed to update permission.', 'Error');
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
    this.loadPermissions();
  }
}
