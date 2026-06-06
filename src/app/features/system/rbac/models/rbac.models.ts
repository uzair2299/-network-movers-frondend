export interface MenuItem {
  id: number;
  name: string;
  icon?: string;
  path?: string;
  section: string;
  parentId?: number;
  permissionId?: string;
  sortOrder: number;
  active: boolean;
  children?: MenuItem[];
}

export interface Resource {
  id: string;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRole {
  id: string;
  userId: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Module {
  id: string;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
