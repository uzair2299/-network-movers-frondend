import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';
import { UserDialogComponent } from '../dialogs/user-dialog/user-dialog.component';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.css']
})
export class UsersListPage implements OnInit {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  sort = 'createdAt,desc';
  searchQuery = '';
  
  moreActions = [
    { id: 'export', label: 'Export Users' },
    { id: 'import', label: 'Import Users' }
  ];

  userActions = [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit User' },
    { id: 'assign_roles', label: 'Assign Roles' }
  ];

  constructor(
    private usersService: UsersService,
    private router: Router,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    this.usersService.getUsers(this.currentPage, this.pageSize, this.sort)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.users = response.content;
          this.totalElements = response.totalElements;
        },
        error: (err) => {
          console.error('Error fetching users', err);
          this.error = 'Failed to load users. Please try again later.';
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0; // Reset to first page when changing page size
    this.loadUsers();
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 0;
    // Note: If the backend supports a search param, add it to usersService.getUsers()
    this.loadUsers();
  }

  createNewUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      hasBackdrop: true,
      data: null,
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.usersService.createUser(result).subscribe({
          next: () => {
            this.toastService.showSuccess('User created successfully.', 'Success');
            this.loadUsers();
          },
          error: (err) => {
            console.error('Failed to create user', err);
            this.toastService.showError('Failed to create user.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handleUserAction(actionId: string, user: User): void {
    if (actionId === 'assign_roles') {
      this.router.navigate(['/system/users', user.id, 'assign-roles']);
    } else {
      console.log('User action clicked:', actionId, 'for user:', user.username);
    }
  }
}
