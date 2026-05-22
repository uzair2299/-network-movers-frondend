import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  username = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.error = null;
    this.loading = true;

    this.authService
      .login(this.username, this.password)
      .then(() => {
        this.loading = false;
        this.router.navigate(['/']);
      })
      .catch(() => {
        this.loading = false;
        this.error = 'Unable to sign in. Please try again.';
      });
  }
}
