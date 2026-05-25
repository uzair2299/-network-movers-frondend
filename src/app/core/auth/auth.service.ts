import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '../services/config.service';

export interface LoginResponse {
  token?: string;
  access_token?: string;
  token_type?: string;
  username?: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';

  constructor(private http: HttpClient, private config: ConfigService) {}

  private getLoginUrl(): string {
    const authBaseUrl = this.config.get<string>('authBaseUrl');
    if (authBaseUrl) {
      const trimmed = authBaseUrl.replace(/\/+$/, '');
      if (trimmed.endsWith('/v1/auth') || trimmed.endsWith('/auth')) {
        return `${trimmed}/login`;
      }
      return `${trimmed}/v1/auth/login`;
    }

    const apiBaseUrl = this.config.get<string>('apiBaseUrl', '/api')?.replace(/\/+$/, '') || '/api';
    return `${apiBaseUrl}/v1/auth/login`;
  }

  login(username: string, password: string): Promise<void> {
    const url = this.getLoginUrl();
    return firstValueFrom(
      this.http.post<LoginResponse>(url, { username, password }, { headers: { 'Content-Type': 'application/json' } })
    ).then(response => {
      const token = response.access_token || response.token;
      if (!token) {
        return Promise.reject(new Error('Login response did not include an authentication token.'));
      }

      localStorage.setItem(this.tokenKey, token);
      return Promise.resolve();
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
