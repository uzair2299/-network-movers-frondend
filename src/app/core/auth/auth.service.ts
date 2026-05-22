import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'network-movers-token';

  login(username: string, password: string): Promise<void> {
    return Promise.resolve().then(() => {
      localStorage.setItem(this.tokenKey, 'fake-jwt-token');
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
