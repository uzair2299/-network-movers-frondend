import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { VehicleType } from '../models/vehicle-type.model';
import { ApiService } from '../../../../../core/services/api.service';
import { PaginatedResponse } from '../../../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypesService {
  constructor(private api: ApiService) {}

  getVehicleTypes(page: number = 0, size: number = 20, sort: string = 'createdAt,desc', search?: string): Observable<PaginatedResponse<VehicleType>> {
    let params: any = { page: page.toString(), size: size.toString(), sort };
    if (search) {
      params.search = search;
    }
    return this.api.get<PaginatedResponse<VehicleType>>('/admin/fleet/vehicle-types', {
      params
    }).pipe(
      map(response => response instanceof HttpResponse ? response.body as PaginatedResponse<VehicleType> : response as PaginatedResponse<VehicleType>)
    );
  }

  getVehicleTypeById(id: string): Observable<VehicleType> {
    return this.api.get<VehicleType>(`/admin/fleet/vehicle-types/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as VehicleType : response as VehicleType)
    );
  }

  createVehicleType(vehicleTypeData: Partial<VehicleType>): Observable<VehicleType> {
    return this.api.post<VehicleType>('/admin/fleet/vehicle-types', vehicleTypeData).pipe(
      map(response => response instanceof HttpResponse ? response.body as VehicleType : response as VehicleType)
    );
  }

  updateVehicleType(id: string, vehicleTypeData: Partial<VehicleType>): Observable<VehicleType> {
    return this.api.put<VehicleType>(`/admin/fleet/vehicle-types/${id}`, vehicleTypeData).pipe(
      map(response => response instanceof HttpResponse ? response.body as VehicleType : response as VehicleType)
    );
  }

  deleteVehicleType(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/fleet/vehicle-types/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as void : response as void)
    );
  }
}
