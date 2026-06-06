import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { VehicleModel, VehicleModelPayload } from '../models/vehicle-model.model';
import { ApiService } from '../../../../../core/services/api.service';
import { PaginatedResponse } from '../../../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleModelsService {
  constructor(private api: ApiService) {}

  getVehicleModels(page: number = 0, size: number = 20, sort: string = 'createdAt,desc', search?: string): Observable<PaginatedResponse<VehicleModel>> {
    let params: any = { page: page.toString(), size: size.toString(), sort };
    if (search) {
      params.search = search;
    }
    return this.api.get<PaginatedResponse<VehicleModel>>('/admin/fleet/vehicle-models', {
      params
    }).pipe(
      map(response => response instanceof HttpResponse ? response.body as PaginatedResponse<VehicleModel> : response as PaginatedResponse<VehicleModel>)
    );
  }

  getVehicleModelById(id: string): Observable<VehicleModel> {
    return this.api.get<VehicleModel>(`/admin/fleet/vehicle-models/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as VehicleModel : response as VehicleModel)
    );
  }

  createVehicleModel(payload: VehicleModelPayload): Observable<VehicleModel> {
    return this.api.post<VehicleModel>('/admin/fleet/vehicle-models', payload).pipe(
      map(response => response instanceof HttpResponse ? response.body as VehicleModel : response as VehicleModel)
    );
  }

  updateVehicleModel(id: string, payload: VehicleModelPayload): Observable<VehicleModel> {
    return this.api.put<VehicleModel>(`/admin/fleet/vehicle-models/${id}`, payload).pipe(
      map(response => response instanceof HttpResponse ? response.body as VehicleModel : response as VehicleModel)
    );
  }

  deleteVehicleModel(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/fleet/vehicle-models/${id}`).pipe(
      map(response => response instanceof HttpResponse ? response.body as void : response as void)
    );
  }
}
