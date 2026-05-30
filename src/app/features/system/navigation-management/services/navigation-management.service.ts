import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../../core/services/api.service';
import { 
  NavigationItemModel, 
  NavigationMenuResponse, 
  NavigationCreateRequest,
  NavigationBulkUpdateRequest 
} from '../models/navigation-item.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationManagementService {
  private readonly baseEndpoint = '/navigation';

  constructor(private api: ApiService) {}

  /**
   * Get all navigation items across all sections
   */
  getAllNavigationItems(): Observable<NavigationMenuResponse> {
    return this.api.get<NavigationMenuResponse>(`${this.baseEndpoint}`) as Observable<NavigationMenuResponse>;
  }

  /**
   * Get navigation items by section
   */
  getNavigationItemsBySection(section: 'PROFILE' | 'SIDEBAR' | 'TOPBAR'): Observable<NavigationItemModel[]> {
    return this.api.get<NavigationItemModel[]>(`${this.baseEndpoint}/section/${section}`) as Observable<NavigationItemModel[]>;
  }

  /**
   * Get single navigation item by id
   */
  getNavigationItemById(id: number): Observable<NavigationItemModel> {
    return this.api.get<NavigationItemModel>(`${this.baseEndpoint}/${id}`) as Observable<NavigationItemModel>;
  }

  /**
   * Create new navigation item
   */
  createNavigationItem(request: NavigationCreateRequest): Observable<NavigationItemModel> {
    return this.api.post<NavigationItemModel>(`${this.baseEndpoint}`, request) as Observable<NavigationItemModel>;
  }

  /**
   * Update existing navigation item
   */
  updateNavigationItem(id: number, request: NavigationCreateRequest): Observable<NavigationItemModel> {
    return this.api.put<NavigationItemModel>(`${this.baseEndpoint}/${id}`, request) as Observable<NavigationItemModel>;
  }

  /**
   * Delete navigation item
   */
  deleteNavigationItem(id: number): Observable<void> {
    return this.api.delete<void>(`${this.baseEndpoint}/${id}`) as Observable<void>;
  }

  /**
   * Bulk update navigation items (for reordering, bulk activation/deactivation)
   */
  bulkUpdateNavigationItems(request: NavigationBulkUpdateRequest): Observable<NavigationMenuResponse> {
    return this.api.post<NavigationMenuResponse>(`${this.baseEndpoint}/bulk-update`, request) as Observable<NavigationMenuResponse>;
  }

  /**
   * Reorder navigation items within a section
   */
  reorderNavigationItems(section: 'PROFILE' | 'SIDEBAR' | 'TOPBAR', items: NavigationItemModel[]): Observable<NavigationMenuResponse> {
    return this.api.post<NavigationMenuResponse>(
      `${this.baseEndpoint}/section/${section}/reorder`,
      { items }
    ) as Observable<NavigationMenuResponse>;
  }

  /**
   * Toggle activation status
   */
  toggleNavigationItemActive(id: number, active: boolean): Observable<NavigationItemModel> {
    return this.api.put<NavigationItemModel>(
      `${this.baseEndpoint}/${id}/active`,
      { active }
    ) as Observable<NavigationItemModel>;
  }

  /**
   * Export navigation configuration as a Blob.
   * Uses observeResponse to access the raw HttpResponse and extracts the body.
   */
  exportNavigation(): Observable<Blob> {
    return (this.api.get<Blob>(`${this.baseEndpoint}/export`, {
      observeResponse: true
    }) as Observable<HttpResponse<Blob>>).pipe(
      map((response: HttpResponse<Blob>) => response.body as Blob)
    );
  }

  /**
   * Import navigation configuration
   */
  importNavigation(file: File): Observable<NavigationMenuResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.api.post<NavigationMenuResponse>(
      `${this.baseEndpoint}/import`,
      formData
    ) as Observable<NavigationMenuResponse>;
  }
}
