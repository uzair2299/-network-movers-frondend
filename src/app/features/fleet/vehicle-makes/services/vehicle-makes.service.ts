import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { VehicleMake } from '../models/vehicle-make.model';
import { ApiService } from '../../../../core/services/api.service';
import { PaginatedResponse } from '../../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleMakesService {
  constructor(private api: ApiService) {}

  getVehicleMakes(page: number = 0, size: number = 20, sort: string = 'createdAt,desc'): Observable<PaginatedResponse<VehicleMake>> {
    return this.api.get<PaginatedResponse<VehicleMake>>('/admin/fleet/vehicle-makes', {
      params: { page: page.toString(), size: size.toString(), sort }
    }).pipe(
      map(response => response instanceof HttpResponse ? response.body as PaginatedResponse<VehicleMake> : response as PaginatedResponse<VehicleMake>)
    );
  }

  getVehicleMakeById(id: string): Observable<VehicleMake> {
    return this.api.get<VehicleMake>(`/admin/fleet/vehicle-makes/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as VehicleMake : response as VehicleMake)
    );
  }
}
