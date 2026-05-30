import { Injectable } from '@angular/core';
import { JwtService } from '../../../../core/auth/jwt.service';
import { NavigationPermission, PermissionContext } from '../models/permissions.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationPermissionService {
  constructor(private jwtService: JwtService) {}

  /**
   * Check if user has a specific navigation permission
   */
  hasPermission(permission: NavigationPermission): boolean {
    // TEMPORARY BYPASS: Always return true so all buttons are visible
    return true;
  }

  /**
   * Check multiple permissions (AND logic)
   */
  hasAllPermissions(permissions: NavigationPermission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Check multiple permissions (OR logic)
   */
  hasAnyPermission(permissions: NavigationPermission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Get permission context for the view
   */
  getPermissionContext(): PermissionContext {
    return {
      canCreate: this.hasPermission(NavigationPermission.CREATE),
      canEdit: this.hasPermission(NavigationPermission.UPDATE),
      canDelete: this.hasPermission(NavigationPermission.DELETE),
      canExport: this.hasPermission(NavigationPermission.EXPORT),
      canImport: this.hasPermission(NavigationPermission.IMPORT),
      canBulkUpdate: this.hasPermission(NavigationPermission.BULK_UPDATE)
    };
  }

  /**
   * Get user's permissions from JWT token
   */
  private getUserPermissions(): string[] {
    try {
      const decoded = this.jwtService.getDecodedToken();
      if (!decoded) return [];

      // Check for permissions in token (could be in 'permissions', 'scopes', 'roles', etc.)
      const permissions = decoded.permissions || decoded.scopes || [];
      return Array.isArray(permissions) ? permissions : [];
    } catch (error) {
      console.error('Error decoding permissions from token:', error);
      return [];
    }
  }

  /**
   * Check if user is admin (may have all permissions)
   */
  isAdmin(): boolean {
    try {
      const decoded = this.jwtService.getDecodedToken();
      if (!decoded) return false;

      const roles = decoded.roles || [];
      return (Array.isArray(roles) && roles.includes('admin')) || decoded.sub === 'admin';
    } catch (error) {
      return false;
    }
  }
}
