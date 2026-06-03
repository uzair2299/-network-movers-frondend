import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Role } from '../models/role.model';
import { RolesService } from '../services/roles.service';

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
  sort = 'createdAt,desc';
  searchQuery = '';
  
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

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    this.error = null;
    this.rolesService.getRoles(this.currentPage, this.pageSize, this.sort)
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
    console.log('Create new role clicked');
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handleRoleAction(actionId: string, role: Role): void {
    console.log('Role action clicked:', actionId, 'for role:', role.code);
  }
}
