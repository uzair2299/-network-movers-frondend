import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Role } from '../models/role.model';
import { RolesService } from '../services/roles.service';
import { RoleDialogComponent } from '../dialogs/role-dialog/role-dialog.component';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.page.html',
  styleUrls: ['./roles-list.page.css']
})
export class RolesListPage implements OnInit {
  roles: Role[] = [];
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
    this.loadRoles();
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
    this.searchQuery = query;
    this.currentPage = 0;
    this.loadRoles();
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
    console.log('Role action clicked:', actionId, 'for role:', role.code);
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
