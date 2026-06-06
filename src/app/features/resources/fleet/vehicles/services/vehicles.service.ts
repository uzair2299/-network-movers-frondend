import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Vehicle, VehiclePayload } from '../models/vehicle.model';
import { ApiService } from '../../../../../core/services/api.service';
import { PaginatedResponse } from '../../../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  constructor(private api: ApiService) {}

  getVehicles(page: number = 0, size: number = 20, sort: string = 'createdAt,desc', search?: string): Observable<PaginatedResponse<Vehicle>> {
    let params: any = { page: page.toString(), size: size.toString(), sort };
    if (search) {
      params.search = search;
    }
    return this.api.get<PaginatedResponse<Vehicle>>('/admin/fleet/vehicles', {
      params
    }).pipe(
      map(response => response instanceof HttpResponse ? response.body as PaginatedResponse<Vehicle> : response as PaginatedResponse<Vehicle>)
    );
  }

  getVehicleById(id: string): Observable<Vehicle> {
    return this.api.get<Vehicle>(`/admin/fleet/vehicles/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as Vehicle : response as Vehicle)
    );
  }

  createVehicle(payload: VehiclePayload): Observable<Vehicle> {
    return this.api.post<Vehicle>('/admin/fleet/vehicles', payload).pipe(
      map(response => response instanceof HttpResponse ? response.body as Vehicle : response as Vehicle)
    );
  }

  updateVehicle(id: string, payload: VehiclePayload): Observable<Vehicle> {
    return this.api.put<Vehicle>(`/admin/fleet/vehicles/${id}`, payload).pipe(
      map(response => response instanceof HttpResponse ? response.body as Vehicle : response as Vehicle)
    );
  }

  deleteVehicle(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/fleet/vehicles/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as void : response as void)
    );
  }
}
