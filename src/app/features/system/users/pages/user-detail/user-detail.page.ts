import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { UserDialogComponent } from '../../dialogs/user-dialog/user-dialog.component';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.css']
})
export class UserDetailPage implements OnInit {
  user: User | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadUser(id);
      } else {
        this.goBack();
      }
    });
  }

  loadUser(id: string): void {
    this.isLoading = true;
    this.error = null;
    this.usersService.getUserById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (err) => {
          console.error('Error loading user details', err);
          this.error = 'Failed to load user details. Please try again.';
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/system/users']);
  }

  assignRoles(): void {
    if (this.user) {
      this.router.navigate(['/system/users', this.user.id, 'assign-roles']);
    }
  }

  editUser(): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      disableClose: true,
      hasBackdrop: true,
      data: this.user,
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.usersService.updateUser(this.user!.id, result).subscribe({
          next: (updatedUser) => {
            this.toastService.showSuccess('User updated successfully.', 'Success');
            this.loadUser(this.user!.id); // Reload user details
          },
          error: (err) => {
            console.error('Failed to update user', err);
            this.toastService.showError('Failed to update user.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }
}
