import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  PaginatedResponse, BaseLookup, BaseLookupRequest,
  PropertyCategory, PropertyType, PropertyTypeRequest,
  PropertySize, PropertySizeRequest, FloorType, BuildingAccessType,
  ParkingAccessType, AccessRestrictionType
} from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private baseUrl = 'https://network-movers-backend-production.up.railway.app/api/v1/admin';

  constructor(private http: HttpClient) {}

  private getList<T>(endpoint: string): Observable<T[]> {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${this.baseUrl}/${endpoint}${separator}page=0&size=1000&sort=name,asc`;
    return this.http.get<PaginatedResponse<T>>(url).pipe(
      map(res => res.content || [])
    );
  }

  private createItem<T, R>(endpoint: string, request: R): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, request);
  }

  private updateItem<T, R>(endpoint: string, id: string, request: R): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, request);
  }

  private deleteItem(endpoint: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  // 1. Property Categories
  getCategories(): Observable<PropertyCategory[]> { return this.getList('property-category'); }
  createCategory(req: BaseLookupRequest): Observable<PropertyCategory> { return this.createItem('property-category', req); }
  updateCategory(id: string, req: BaseLookupRequest): Observable<PropertyCategory> { return this.updateItem('property-category', id, req); }
  deleteCategory(id: string): Observable<void> { return this.deleteItem('property-category', id); }

  // 2. Property Types
  getTypes(): Observable<PropertyType[]> { return this.getList('property-type'); }
  createType(req: PropertyTypeRequest): Observable<PropertyType> { return this.createItem('property-type', req); }
  updateType(id: string, req: PropertyTypeRequest): Observable<PropertyType> { return this.updateItem('property-type', id, req); }
  deleteType(id: string): Observable<void> { return this.deleteItem('property-type', id); }

  // 3. Property Sizes
  getSizes(): Observable<PropertySize[]> { return this.getList('property-size'); }
  createSize(req: PropertySizeRequest): Observable<PropertySize> { return this.createItem('property-size', req); }
  updateSize(id: string, req: PropertySizeRequest): Observable<PropertySize> { return this.updateItem('property-size', id, req); }
  deleteSize(id: string): Observable<void> { return this.deleteItem('property-size', id); }

  // 4. Floor Types
  getFloorTypes(): Observable<FloorType[]> { return this.getList('floor-type'); }
  getActiveFloorTypes(): Observable<FloorType[]> { return this.http.get<FloorType[]>(`${this.baseUrl}/floor-type/active`); }
  createFloorType(req: BaseLookupRequest): Observable<FloorType> { return this.createItem('floor-type', req); }
  updateFloorType(id: string, req: BaseLookupRequest): Observable<FloorType> { return this.updateItem('floor-type', id, req); }
  deleteFloorType(id: string): Observable<void> { return this.deleteItem('floor-type', id); }

  // 5. Building Access
  getBuildingAccessTypes(): Observable<BuildingAccessType[]> { return this.getList('building-access-type'); }
  getActiveBuildingAccessTypes(): Observable<BuildingAccessType[]> { return this.http.get<BuildingAccessType[]>(`${this.baseUrl}/building-access-type/active`); }
  createBuildingAccessType(req: BaseLookupRequest): Observable<BuildingAccessType> { return this.createItem('building-access-type', req); }
  updateBuildingAccessType(id: string, req: BaseLookupRequest): Observable<BuildingAccessType> { return this.updateItem('building-access-type', id, req); }
  deleteBuildingAccessType(id: string): Observable<void> { return this.deleteItem('building-access-type', id); }

  // 6. Parking Access
  getParkingAccessTypes(): Observable<ParkingAccessType[]> { return this.getList('parking-access-type'); }
  getActiveParkingAccessTypes(): Observable<ParkingAccessType[]> { return this.http.get<ParkingAccessType[]>(`${this.baseUrl}/parking-access-type/active`); }
  createParkingAccessType(req: BaseLookupRequest): Observable<ParkingAccessType> { return this.createItem('parking-access-type', req); }
  updateParkingAccessType(id: string, req: BaseLookupRequest): Observable<ParkingAccessType> { return this.updateItem('parking-access-type', id, req); }
  deleteParkingAccessType(id: string): Observable<void> { return this.deleteItem('parking-access-type', id); }

  // 7. Access Restrictions
  getAccessRestrictions(): Observable<AccessRestrictionType[]> { return this.getList('access-restriction-type'); }
  getActiveAccessRestrictions(): Observable<AccessRestrictionType[]> { return this.http.get<AccessRestrictionType[]>(`${this.baseUrl}/access-restriction-type/active`); }
  createAccessRestriction(req: BaseLookupRequest): Observable<AccessRestrictionType> { return this.createItem('access-restriction-type', req); }
  updateAccessRestriction(id: string, req: BaseLookupRequest): Observable<AccessRestrictionType> { return this.updateItem('access-restriction-type', id, req); }
  deleteAccessRestriction(id: string): Observable<void> { return this.deleteItem('access-restriction-type', id); }
}
