export interface NavigationItemModel {
  id: number;
  name: string;
  icon?: string;
  path?: string;
  section: 'PROFILE' | 'SIDEBAR' | 'TOPBAR';
  sortOrder: number;
  active: boolean;
  children?: NavigationItemModel[];
}

export interface NavigationMenuResponse {
  PROFILE?: NavigationItemModel[];
  SIDEBAR?: NavigationItemModel[];
  TOPBAR?: NavigationItemModel[];
}

export interface NavigationCreateRequest {
  name: string;
  icon?: string;
  path?: string;
  section: 'PROFILE' | 'SIDEBAR' | 'TOPBAR';
  sortOrder: number;
  active: boolean;
  parentId?: number;
}

export interface NavigationUpdateRequest extends NavigationCreateRequest {
  id: number;
}

export interface NavigationBulkUpdateRequest {
  items: NavigationItemModel[];
}
