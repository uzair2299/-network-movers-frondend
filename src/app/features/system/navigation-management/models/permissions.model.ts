export enum NavigationPermission {
  CREATE = 'navigation:create',
  READ = 'navigation:read',
  UPDATE = 'navigation:update',
  DELETE = 'navigation:delete',
  BULK_UPDATE = 'navigation:bulk_update',
  EXPORT = 'navigation:export',
  IMPORT = 'navigation:import'
}

export interface PermissionContext {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  canImport: boolean;
  canBulkUpdate: boolean;
}
