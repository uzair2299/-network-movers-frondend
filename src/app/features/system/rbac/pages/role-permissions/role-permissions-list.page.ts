import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { RolePermission } from '../../models/rbac.models';
import { RbacService } from '../../services/rbac.service';
import { RolePermissionDialogComponent } from '../../dialogs/role-permission-dialog/role-permission-dialog.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TableColumn } from '../../../../../shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-role-permissions-list',
  templateUrl: './role-permissions-list.page.html',
  styleUrls: ['./role-permissions-list.page.css']
})
export class RolePermissionsListPage implements OnInit, OnDestroy {
  rolePermissions: any[] = [];
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
    { id: 'export', label: 'Export Assignments' }
  ];

  rowActions = [
    { id: 'revoke', label: 'Revoke / Delete' }
  ];

  tableColumns: TableColumn[] = [
    { key: 'roleName', label: 'Role', type: 'text', sortable: true, bold: true },
    { key: 'roleCode', label: 'Role Code', type: 'text', sortable: false },
    { key: 'permissionName', label: 'Permission', type: 'text', sortable: true },
    { key: 'permissionCode', label: 'Permission Code', type: 'text', sortable: false },
    { key: 'active', label: 'Status', type: 'status', sortable: true },
    { key: 'createdAt', label: 'Assigned Date', type: 'text', sortable: true },
    {
      key: 'actions',
      label: '',
      type: 'actions',
      actionsDropdown: true,
      dropdownItems: this.rowActions
    }
  ];

  constructor(
    private rbacService: RbacService,
    private dialog: MatDialog,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadRolePermissions();
    });

    this.loadRolePermissions();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadRolePermissions(): void {
    this.isLoading = true;
    this.error = null;
    this.rbacService.getRolePermissions(this.currentPage, this.pageSize, this.sort)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.rolePermissions = response.content.map((rp: RolePermission) => ({
            id: rp.id,
            roleName: rp.roleName || 'N/A',
            roleCode: rp.roleCode || 'N/A',
            permissionName: rp.permissionName || 'N/A',
            permissionCode: rp.permissionCode || 'N/A',
            active: rp.active,
            createdAt: rp.createdAt
          }));
          this.totalElements = response.totalElements;
        },
        error: (err) => {
          console.error('Error fetching role permissions', err);
          this.error = 'Failed to load role-permission assignments. Please try again.';
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRolePermissions();
  }

  onSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadRolePermissions();
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  assignPermission(): void {
    this.router.navigate(['assign'], { relativeTo: this.route });
  }

  handleMoreAction(actionId: string): void {
    console.log('More action:', actionId);
  }

  handleTableAction(event: { action: string; item: any }): void {
    if (event.action === 'revoke') {
      this.revokePermission(event.item);
    }
  }

  revokePermission(mapping: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      disableClose: true,
      data: {
        title: 'Revoke Permission',
        message: `Are you sure you want to revoke the permission "${mapping.permissionName}" from role "${mapping.roleName}"? This action will soft-delete the assignment.`,
        confirmText: 'Revoke',
        cancelText: 'Cancel',
        type: 'danger'
      },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = true;
        this.rbacService.revokeRolePermission(mapping.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Permission revoked successfully.', 'Success');
            this.loadRolePermissions();
          },
          error: (err) => {
            console.error('Error revoking permission', err);
            this.toastService.showError('Failed to revoke permission.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 0;
    this.loadRolePermissions();
  }
}
