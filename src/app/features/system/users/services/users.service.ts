import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User, UserPayload } from '../models/user.model';
import { UserRole } from '../../rbac/models/rbac.models';
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

  getUserById(id: string): Observable<User> {
    return this.api.get<User>(`/admin/users/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as User : response as User)
    );
  }

  getUserRoles(userId: string): Observable<UserRole[]> {
    return this.api.get<UserRole[]>(`/admin/rbac/user-roles/user/${userId}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as UserRole[] : response as UserRole[])
    );
  }

  createUser(payload: UserPayload): Observable<User> {
    return this.api.post<User>('/admin/users', payload).pipe(
      map(response => response instanceof HttpResponse ? response.body as User : response as User)
    );
  }

  updateUser(id: string, payload: Partial<UserPayload>): Observable<User> {
    return this.api.put<User>(`/admin/users/${id}`, payload).pipe(
      map(response => response instanceof HttpResponse ? response.body as User : response as User)
    );
  }

  updateUserRoles(userId: string, roleIds: string[]): Observable<any> {
    return this.api.put<any>('/admin/rbac/user-roles/bulk', {
      userId,
      roleIds
    }).pipe(
      map(response => response instanceof HttpResponse ? response.body : response)
    );
  }
}
