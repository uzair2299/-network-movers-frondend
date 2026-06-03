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

  getRoles(page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Observable<PaginatedResponse<Role>> {
    return this.api.get<PaginatedResponse<Role>>('/admin/roles', {
      params: { page: page.toString(), size: size.toString(), sort }
    }).pipe(
      map(response => response instanceof HttpResponse ? response.body as PaginatedResponse<Role> : response as PaginatedResponse<Role>)
    );
  }
}
