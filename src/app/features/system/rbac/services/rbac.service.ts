import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../../core/services/api.service';
import { PaginatedResponse } from '../../../../core/models/pagination.model';
import { MenuItem, Resource, Permission, Role, UserRole, Module } from '../models/rbac.models';

@Injectable({
  providedIn: 'root'
})
export class RbacService {
  constructor(private api: ApiService) {}

  // =========================================================================
  // MODULES
  // =========================================================================
  getModules(page: number = 0, size: number = 20, sort: string = 'createdAt,desc', search?: string): Observable<PaginatedResponse<Module>> {
    let params: any = { page: page.toString(), size: size.toString(), sort };
    if (search) params.search = search;
    return this.api.get<PaginatedResponse<Module>>('/admin/rbac/modules', { params }).pipe(
      map(res => res instanceof HttpResponse ? res.body as PaginatedResponse<Module> : res as PaginatedResponse<Module>)
    );
  }

  getModuleById(id: string): Observable<Module> {
    return this.api.get<Module>(`/admin/rbac/modules/${id}`).pipe(
      map(res => res instanceof HttpResponse ? res.body as Module : res as Module)
    );
  }

  createModule(data: Partial<Module>): Observable<Module> {
    return this.api.post<Module>('/admin/rbac/modules', data).pipe(
      map(res => res instanceof HttpResponse ? res.body as Module : res as Module)
    );
  }

  updateModule(id: string, data: Partial<Module>): Observable<Module> {
    return this.api.put<Module>(`/admin/rbac/modules/${id}`, data).pipe(
      map(res => res instanceof HttpResponse ? res.body as Module : res as Module)
    );
  }

  deleteModule(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/rbac/modules/${id}`).pipe(
      map(res => res instanceof HttpResponse ? res.body as void : res as void)
    );
  }

  // =========================================================================
  // RESOURCES
  // =========================================================================
  getResources(page: number = 0, size: number = 20, sort: string = 'createdAt,desc', search?: string): Observable<PaginatedResponse<Resource>> {
    let params: any = { page: page.toString(), size: size.toString(), sort };
    if (search) params.search = search;
    return this.api.get<PaginatedResponse<Resource>>('/admin/rbac/resources', { params }).pipe(
      map(res => res instanceof HttpResponse ? res.body as PaginatedResponse<Resource> : res as PaginatedResponse<Resource>)
    );
  }

  getResourceById(id: string): Observable<Resource> {
    return this.api.get<Resource>(`/admin/rbac/resources/${id}`).pipe(
      map(res => res instanceof HttpResponse ? res.body as Resource : res as Resource)
    );
  }

  createResource(data: Partial<Resource>): Observable<Resource> {
    return this.api.post<Resource>('/admin/rbac/resources', data).pipe(
      map(res => res instanceof HttpResponse ? res.body as Resource : res as Resource)
    );
  }

  updateResource(id: string, data: Partial<Resource>): Observable<Resource> {
    return this.api.put<Resource>(`/admin/rbac/resources/${id}`, data).pipe(
      map(res => res instanceof HttpResponse ? res.body as Resource : res as Resource)
    );
  }

  deleteResource(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/rbac/resources/${id}`).pipe(
      map(res => res instanceof HttpResponse ? res.body as void : res as void)
    );
  }

  // =========================================================================
  // PERMISSIONS
  // =========================================================================
  getPermissions(page: number = 0, size: number = 20, sort: string = 'createdAt,desc', search?: string): Observable<PaginatedResponse<Permission>> {
    let params: any = { page: page.toString(), size: size.toString(), sort };
    if (search) params.search = search;
    return this.api.get<PaginatedResponse<Permission>>('/admin/rbac/permissions', { params }).pipe(
      map(res => res instanceof HttpResponse ? res.body as PaginatedResponse<Permission> : res as PaginatedResponse<Permission>)
    );
  }

  getPermissionById(id: string): Observable<Permission> {
    return this.api.get<Permission>(`/admin/rbac/permissions/${id}`).pipe(
      map(res => res instanceof HttpResponse ? res.body as Permission : res as Permission)
    );
  }

  createPermission(data: Partial<Permission>): Observable<Permission> {
    return this.api.post<Permission>('/admin/rbac/permissions', data).pipe(
      map(res => res instanceof HttpResponse ? res.body as Permission : res as Permission)
    );
  }

  updatePermission(id: string, data: Partial<Permission>): Observable<Permission> {
    return this.api.put<Permission>(`/admin/rbac/permissions/${id}`, data).pipe(
      map(res => res instanceof HttpResponse ? res.body as Permission : res as Permission)
    );
  }

  deletePermission(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/rbac/permissions/${id}`).pipe(
      map(res => res instanceof HttpResponse ? res.body as void : res as void)
    );
  }

  // =========================================================================
  // ROLES
  // =========================================================================
  getRoles(page: number = 0, size: number = 20, sort: string = 'createdAt,desc', search?: string): Observable<PaginatedResponse<Role>> {
    let params: any = { page: page.toString(), size: size.toString(), sort };
    if (search) params.search = search;
    return this.api.get<PaginatedResponse<Role>>('/admin/rbac/roles', { params }).pipe(
      map(res => res instanceof HttpResponse ? res.body as PaginatedResponse<Role> : res as PaginatedResponse<Role>)
    );
  }

  getRoleById(id: string): Observable<Role> {
    return this.api.get<Role>(`/admin/rbac/roles/${id}`).pipe(
      map(res => res instanceof HttpResponse ? res.body as Role : res as Role)
    );
  }

  createRole(data: Partial<Role>): Observable<Role> {
    return this.api.post<Role>('/admin/rbac/roles', data).pipe(
      map(res => res instanceof HttpResponse ? res.body as Role : res as Role)
    );
  }

  updateRole(id: string, data: Partial<Role>): Observable<Role> {
    return this.api.put<Role>(`/admin/rbac/roles/${id}`, data).pipe(
      map(res => res instanceof HttpResponse ? res.body as Role : res as Role)
    );
  }

  deleteRole(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/rbac/roles/${id}`).pipe(
      map(res => res instanceof HttpResponse ? res.body as void : res as void)
    );
  }

  // =========================================================================
  // USER ROLES
  // =========================================================================
  getUserRoles(page: number = 0, size: number = 20, sort: string = 'createdAt,desc', search?: string): Observable<PaginatedResponse<UserRole>> {
    let params: any = { page: page.toString(), size: size.toString(), sort };
    if (search) params.search = search;
    return this.api.get<PaginatedResponse<UserRole>>('/admin/rbac/user-roles', { params }).pipe(
      map(res => res instanceof HttpResponse ? res.body as PaginatedResponse<UserRole> : res as PaginatedResponse<UserRole>)
    );
  }

  assignUserRole(userId: string, roleId: string): Observable<UserRole> {
    return this.api.post<UserRole>('/admin/rbac/user-roles', { userId, roleId }).pipe(
      map(res => res instanceof HttpResponse ? res.body as UserRole : res as UserRole)
    );
  }

  assignUserRolesBulk(userId: string, roleIds: string[]): Observable<UserRole[]> {
    return this.api.post<UserRole[]>('/admin/rbac/user-roles/bulk', { userId, roleIds }).pipe(
      map(res => res instanceof HttpResponse ? res.body as UserRole[] : res as UserRole[])
    );
  }

  unassignUserRole(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/rbac/user-roles/${id}`).pipe(
      map(res => res instanceof HttpResponse ? res.body as void : res as void)
    );
  }

  getRolesForUser(userId: string): Observable<UserRole[]> {
    return this.api.get<UserRole[]>(`/admin/rbac/user-roles/user/${userId}`).pipe(
      map(res => res instanceof HttpResponse ? res.body as UserRole[] : res as UserRole[])
    );
  }
}
