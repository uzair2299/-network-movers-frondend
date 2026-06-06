import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Role } from '../models/role.model';
import { RolesService } from '../services/roles.service';
import { RoleDialogComponent } from '../dialogs/role-dialog/role-dialog.component';
import { RoleDetailDialogComponent } from '../dialogs/role-detail-dialog/role-detail-dialog.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.page.html',
  styleUrls: ['./roles-list.page.css']
})
export class RolesListPage implements OnInit, OnDestroy {
  roles: Role[] = [];
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
    { id: 'export', label: 'Export Roles' },
    { id: 'import', label: 'Import Roles' }
  ];

  roleActions = [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Role' },
    { id: 'permissions', label: 'Manage Permissions' },
    { id: 'delete', label: 'Delete Role' }
  ];

  constructor(
    private rolesService: RolesService,
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
      this.loadRoles();
    });

    this.loadRoles();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadRoles(): void {
    this.isLoading = true;
    this.error = null;
    this.rolesService.getRoles(this.currentPage, this.pageSize, this.sort, this.searchQuery)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.roles = response.content;
          this.totalElements = response.totalElements;
        },
        error: (err) => {
          console.error('Error fetching roles', err);
          this.error = 'Failed to load roles. Please try again later.';
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRoles();
  }

  onSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadRoles();
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  createNewRole(): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { isEdit: false },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: Role | null) => {
      if (result) {
        this.isLoading = true;
        this.rolesService.createRole(result).subscribe({
          next: () => {
            this.toastService.showSuccess('Role created successfully.', 'Success');
            this.loadRoles();
          },
          error: (err) => {
            console.error('Error creating role', err);
            this.error = 'Failed to create role.';
            this.isLoading = false;
          }
        });
      }
    });
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handleRoleAction(actionId: string, role: Role): void {
    if (actionId === 'edit') {
      this.editRole(role);
    } else if (actionId === 'view') {
      this.viewRole(role);
    } else if (actionId === 'delete') {
      this.deleteRole(role);
    } else {
      console.log('Role action clicked:', actionId, 'for role:', role.code);
    }
  }

  deleteRole(role: Role): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Delete Role',
        message: `Are you sure you want to delete the role "${role.name}"? This action will deactivate it.`,
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
        this.rolesService.deleteRole(role.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Role deleted successfully.', 'Success');
            this.loadRoles();
          },
          error: (err) => {
            console.error('Error deleting role', err);
            this.toastService.showError('Failed to delete role.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  viewRole(role: Role): void {
    this.isLoading = true;
    this.rolesService.getRoleById(role.id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (fullRole) => {
        this.dialog.open(RoleDetailDialogComponent, {
          width: '600px',
          maxWidth: '95vw',
          disableClose: false,
          hasBackdrop: true,
          data: { role: fullRole },
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });
      },
      error: (err) => {
        console.error('Error fetching role details', err);
        this.toastService.showError('Failed to load role details.', 'Error');
      }
    });
  }

  editRole(role: Role): void {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { role, isEdit: true },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: Role | null) => {
      if (result) {
        this.isLoading = true;
        this.rolesService.updateRole(role.id, result).subscribe({
          next: () => {
            this.toastService.showSuccess('Role updated successfully.', 'Success');
            this.loadRoles();
          },
          error: (err) => {
            console.error('Error updating role', err);
            this.error = 'Failed to update role.';
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
    this.loadRoles();
  }
}
