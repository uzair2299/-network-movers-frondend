import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ApiService } from '../../../../core/services/api.service';
import { PaginatedResponse } from '../../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private api: ApiService) {}

  getUsers(page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Observable<PaginatedResponse<User>> {
    return this.api.get<PaginatedResponse<User>>('/admin/users', {
      params: { page: page.toString(), size: size.toString(), sort }
    }).pipe(
      map(response => response instanceof HttpResponse ? response.body as PaginatedResponse<User> : response as PaginatedResponse<User>)
    );
  }

  getUserById(id: number): Observable<User> {
    return this.api.get<User>(`/admin/users/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as User : response as User)
    );
  }

  updateUserRoles(userId: number, roleCodes: string[]): Observable<any> {
    // TODO: Replace with the actual endpoint once provided by the backend developer.
    // For now, we simulate a successful save.
    console.log(`Mock saving roles for user ${userId}:`, roleCodes);
    return of({ success: true });
  }
}
