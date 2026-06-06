import { VehicleModel } from '../../vehicle-models/models/vehicle-model.model';

export enum OwnershipType {
  COMPANY = 'COMPANY',
  CONTRACTOR = 'CONTRACTOR',
  RENTAL = 'RENTAL'
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  IN_TRANSIT = 'IN_TRANSIT',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  RETIRED = 'RETIRED'
}

export interface Vehicle {
  id?: string;
  vehicleCode: string;
  registrationNo: string;
  vehicleModel: VehicleModel;
  manufactureYear?: number;
  ownershipType: OwnershipType;
  status: VehicleStatus;
  currentOdometerKm?: number;
  insuranceExpiryDate?: string;
  fitnessExpiryDate?: string;
  acquisitionDate?: string;
  active: boolean;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehiclePayload {
  vehicleCode: string;
  registrationNo: string;
  vehicleModelId: string;
  manufactureYear?: number;
  ownershipType: OwnershipType;
  status: VehicleStatus;
  currentOdometerKm?: number;
  insuranceExpiryDate?: string;
  fitnessExpiryDate?: string;
  acquisitionDate?: string;
  active: boolean;
  remarks?: string;
}
