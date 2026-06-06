import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { UserRole } from '../../models/rbac.models';
import { RbacService } from '../../services/rbac.service';
import { UserRoleDialogComponent } from '../../dialogs/user-role-dialog/user-role-dialog.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TableColumn } from '../../../../../shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-user-roles-list',
  templateUrl: './user-roles-list.page.html',
  styleUrls: ['./user-roles-list.page.css']
})
export class UserRolesListPage implements OnInit, OnDestroy {
  userRoles: any[] = [];
  isLoading = false;
  error: string | null = null;
  
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  sortColumn: string = 'createdAt';
  sortDirection: 'desc' | 'asc' = 'desc';
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  
  get sort(): string {
    return `${this.sortColumn},${this.sortDirection}`;
  }
  
  moreActions = [
    { id: 'export', label: 'Export Mappings' },
    { id: 'import', label: 'Import Mappings' }
  ];

  userRoleActions = [
    { id: 'unassign', label: 'Unassign / Delete' }
  ];

  tableColumns: TableColumn[] = [
    { key: 'userId', label: 'User ID (UUID)', type: 'text', sortable: true },
    { key: 'roleName', label: 'Role Name', type: 'text', sortable: true, bold: true },
    { key: 'roleCode', label: 'Role Code', type: 'text', sortable: false },
    { key: 'createdAt', label: 'Assigned Date', type: 'text', sortable: true },
    { 
      key: 'actions', 
      label: '', 
      type: 'actions', 
      actionsDropdown: true,
      dropdownItems: this.userRoleActions
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
      this.loadUserRoles();
    });

    this.loadUserRoles();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadUserRoles(): void {
    this.isLoading = true;
    this.error = null;
    this.rbacService.getUserRoles(this.currentPage, this.pageSize, this.sort, this.searchQuery)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.userRoles = response.content.map(ur => ({
            id: ur.id,
            userId: ur.userId,
            roleName: ur.role?.name || 'N/A',
            roleCode: ur.role?.code || 'N/A',
            createdAt: ur.createdAt
          }));
          this.totalElements = response.totalElements;
        },
        error: (err) => {
          console.error('Error fetching user roles', err);
          this.error = 'Failed to load user roles. Please try again later.';
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUserRoles();
  }

  onSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadUserRoles();
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  assignNewRole(): void {
    const dialogRef = this.dialog.open(UserRoleDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: {},
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: { userId: string, roleId: string } | null) => {
      if (result) {
        this.isLoading = true;
        this.rbacService.assignUserRole(result.userId, result.roleId).subscribe({
          next: () => {
            this.toastService.showSuccess('Role assigned successfully to user.', 'Success');
            this.loadUserRoles();
          },
          error: (err) => {
            console.error('Error assigning role', err);
            this.toastService.showError('Failed to assign role to user.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handleUserRoleAction(actionId: string, mapping: any): void {
    if (actionId === 'unassign') {
      this.unassignRole(mapping);
    } else {
      console.log('Action clicked:', actionId, 'for mapping:', mapping.id);
    }
  }

  handleTableAction(event: { action: string, item: any }): void {
    this.handleUserRoleAction(event.action, event.item);
  }

  unassignRole(mapping: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Unassign Role',
        message: `Are you sure you want to remove the role "${mapping.roleName}" from user ID "${mapping.userId}"?`,
        confirmText: 'Unassign',
        cancelText: 'Cancel',
        type: 'danger'
      },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = true;
        this.rbacService.unassignUserRole(mapping.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Role unassigned successfully.', 'Success');
            this.loadUserRoles();
          },
          error: (err) => {
            console.error('Error unassigning role', err);
            this.toastService.showError('Failed to unassign role.', 'Error');
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
    this.loadUserRoles();
  }
}
