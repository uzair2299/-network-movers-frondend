import { VehicleMake } from '../../vehicle-makes/models/vehicle-make.model';
import { VehicleType } from '../../vehicle-types/models/vehicle-type.model';

export interface VehicleModel {
  id?: string;
  make: VehicleMake;
  vehicleType: VehicleType;
  code: string;
  name: string;
  active: boolean;
  capacityKg: number;
  capacityM3: number;
  lengthM: number;
  widthM: number;
  heightM: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleModelPayload {
  makeId: string;
  vehicleTypeId: string;
  code: string;
  name: string;
  active: boolean;
  capacityKg: number;
  capacityM3: number;
  lengthM: number;
  widthM: number;
  heightM: number;
}
