export interface PaginatedResponse<T> {
  content: T[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: any;
  size: number;
  sort: any;
  totalElements: number;
  totalPages: number;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface BookingStatus {
  id: string;
  name: string;
  code: string;
  active: boolean;
  phase: any;
  description: string;
  sequenceNo: number;
  colorCode: string;
  customerVisible: boolean;
  internalOnly: boolean;
  createdAt: string;
  final: boolean;
}

export interface RouteDetails {
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  destination_address: string;
  destination_latitude: number;
  destination_longitude: number;
  distance_km: number;
  duration_minutes: number;
}

export interface SchedulingDetails {
  schedule_type: string;
  scheduled_date: string;
  time_slot: string;
}

export interface MoveSpecifications {
  property_category_id: string;
  property_category_code: string;
  property_category_name: string;
  property_type_id: string;
  property_type_code: string;
  property_type_name: string;
  property_size_id: string;
  property_size_code: string;
  property_size_name: string;
}

export interface AccessDetailItem {
  floor_type_id: string;
  floor_type_code: string;
  floor_type_name: string;
  building_access_id: string;
  building_access_code: string;
  building_access_name: string;
  parking_access_id: string;
  parking_access_code: string;
  parking_access_name: string;
  restriction_details: any[];
}

export interface AccessDetails {
  pickup: AccessDetailItem;
  destination: AccessDetailItem;
}

export interface Booking {
  id: number;
  user: UserInfo;
  name: string;
  description: string;
  current_status: BookingStatus;
  route_details: RouteDetails;
  scheduling: SchedulingDetails;
  move_specifications: MoveSpecifications;
  access_details: AccessDetails;
  createdAt: string;
  createdBy: number;
}
