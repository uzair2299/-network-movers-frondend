import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { VehicleMake } from '../models/vehicle-make.model';
import { ApiService } from '../../../../../core/services/api.service';
import { PaginatedResponse } from '../../../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleMakesService {
  constructor(private api: ApiService) {}

  getVehicleMakes(page: number = 0, size: number = 20, sort: string = 'createdAt,desc', search?: string): Observable<PaginatedResponse<VehicleMake>> {
    let params: any = { page: page.toString(), size: size.toString(), sort };
    if (search) {
      params.search = search;
    }
    return this.api.get<PaginatedResponse<VehicleMake>>('/admin/fleet/vehicle-makes', {
      params
    }).pipe(
      map(response => response instanceof HttpResponse ? response.body as PaginatedResponse<VehicleMake> : response as PaginatedResponse<VehicleMake>)
    );
  }

  getVehicleMakeById(id: string): Observable<VehicleMake> {
    return this.api.get<VehicleMake>(`/admin/fleet/vehicle-makes/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as VehicleMake : response as VehicleMake)
    );
  }

  createVehicleMake(vehicleMakeData: Partial<VehicleMake>): Observable<VehicleMake> {
    return this.api.post<VehicleMake>('/admin/fleet/vehicle-makes', vehicleMakeData).pipe(
      map(response => response instanceof HttpResponse ? response.body as VehicleMake : response as VehicleMake)
    );
  }

  updateVehicleMake(id: string, vehicleMakeData: Partial<VehicleMake>): Observable<VehicleMake> {
    return this.api.put<VehicleMake>(`/admin/fleet/vehicle-makes/${id}`, vehicleMakeData).pipe(
      map(response => response instanceof HttpResponse ? response.body as VehicleMake : response as VehicleMake)
    );
  }

  deleteVehicleMake(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/fleet/vehicle-makes/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as void : response as void)
    );
  }
}
