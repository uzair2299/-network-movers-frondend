import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isModalOpen = false;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          
          if (!this.isModalOpen) {
            this.isModalOpen = true;
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              width: '400px',
              disableClose: true,
              data: {
                title: 'Session Expired',
                message: 'Your session has expired or is invalid. Please log in again to continue.',
                confirmText: 'Go to Login',
                cancelText: null,
                type: 'warning'
              },
              panelClass: 'premium-dark-dialog',
              backdropClass: 'premium-backdrop'
            });

            dialogRef.afterClosed().subscribe(() => {
              this.isModalOpen = false;
              this.router.navigate(['/auth/login']);
            });
          }
        }
        return throwError(() => error);
      })
    );
  }
}
