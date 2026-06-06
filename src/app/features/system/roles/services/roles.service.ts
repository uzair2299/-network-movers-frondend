import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Role } from '../models/role.model';
import { ApiService } from '../../../../core/services/api.service';
import { PaginatedResponse } from '../../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  constructor(private api: ApiService) {}

  getRoles(page: number = 0, size: number = 20, sort: string = 'createdAt,desc', search?: string): Observable<PaginatedResponse<Role>> {
    let params: any = { page: page.toString(), size: size.toString(), sort };
    if (search) {
      params.search = search;
    }
    return this.api.get<PaginatedResponse<Role>>('/admin/roles', {
      params
    }).pipe(
      map(response => response instanceof HttpResponse ? response.body as PaginatedResponse<Role> : response as PaginatedResponse<Role>)
    );
  }

  getRoleById(id: string): Observable<Role> {
    return this.api.get<Role>(`/admin/roles/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as Role : response as Role)
    );
  }

  createRole(roleData: Partial<Role>): Observable<Role> {
    return this.api.post<Role>('/admin/roles', roleData).pipe(
      map(response => response instanceof HttpResponse ? response.body as Role : response as Role)
    );
  }

  updateRole(id: string, roleData: Partial<Role>): Observable<Role> {
    return this.api.put<Role>(`/admin/roles/${id}`, roleData).pipe(
      map(response => response instanceof HttpResponse ? response.body as Role : response as Role)
    );
  }

  deleteRole(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/roles/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as void : response as void)
    );
  }
}
