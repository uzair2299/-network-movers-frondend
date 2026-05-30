export interface PaginatedResponse<T> {
  content: T[];
  pageable?: any;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
  size?: number;
  number?: number;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

export interface BaseLookup {
  id: string;
  name: string;
  code: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseLookupRequest {
  name: string;
  code: string;
  active: boolean;
}

export interface PropertyCategory extends BaseLookup {}

export interface PropertyType extends BaseLookup {
  category?: PropertyCategory;
}

export interface PropertyTypeRequest {
  name: string;
  code: string;
  active: boolean;
  categoryId: string;
}

export interface PropertySize extends BaseLookup {
  unitType: string;
  type?: PropertyType;
}

export interface PropertySizeRequest {
  name: string;
  code: string;
  active: boolean;
  typeId: string;
  unitType: string;
}

export interface FloorType extends BaseLookup {}
export interface BuildingAccessType extends BaseLookup {}
export interface ParkingAccessType extends BaseLookup {}
export interface AccessRestrictionType extends BaseLookup {}
