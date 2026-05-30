import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { 
  NavigationItemModel, 
  NavigationMenuResponse, 
  NavigationCreateRequest, 
  NavigationUpdateRequest,
  NavigationBulkUpdateRequest 
} from '../models/navigation-item.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationManagementService {
  private readonly baseEndpoint = '/admin/navigation';

  constructor(private api: ApiService) {}

  /**
   * Get all navigation items across all sections
   */
  getAllNavigationItems(): Observable<NavigationMenuResponse> {
    return this.api.get<NavigationMenuResponse>(`${this.baseEndpoint}`);
  }

  /**
   * Get navigation items by section
   */
  getNavigationItemsBySection(section: 'PROFILE' | 'SIDEBAR' | 'TOPBAR'): Observable<NavigationItemModel[]> {
    return this.api.get<NavigationItemModel[]>(`${this.baseEndpoint}/section/${section}`);
  }

  /**
   * Get single navigation item by id
   */
  getNavigationItemById(id: number): Observable<NavigationItemModel> {
    return this.api.get<NavigationItemModel>(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Create new navigation item
   */
  createNavigationItem(request: NavigationCreateRequest): Observable<NavigationItemModel> {
    return this.api.post<NavigationItemModel>(`${this.baseEndpoint}`, request);
  }

  /**
   * Update existing navigation item
   */
  updateNavigationItem(id: number, request: NavigationCreateRequest): Observable<NavigationItemModel> {
    return this.api.put<NavigationItemModel>(`${this.baseEndpoint}/${id}`, request);
  }

  /**
   * Delete navigation item
   */
  deleteNavigationItem(id: number): Observable<void> {
    return this.api.delete<void>(`${this.baseEndpoint}/${id}`);
  }

  /**
   * Bulk update navigation items (for reordering, bulk activation/deactivation)
   */
  bulkUpdateNavigationItems(request: NavigationBulkUpdateRequest): Observable<NavigationMenuResponse> {
    return this.api.post<NavigationMenuResponse>(`${this.baseEndpoint}/bulk-update`, request);
  }

  /**
   * Reorder navigation items within a section
   */
  reorderNavigationItems(section: 'PROFILE' | 'SIDEBAR' | 'TOPBAR', items: NavigationItemModel[]): Observable<NavigationMenuResponse> {
    return this.api.post<NavigationMenuResponse>(
      `${this.baseEndpoint}/section/${section}/reorder`,
      { items }
    );
  }

  /**
   * Toggle activation status
   */
  toggleNavigationItemActive(id: number, active: boolean): Observable<NavigationItemModel> {
    return this.api.put<NavigationItemModel>(
      `${this.baseEndpoint}/${id}/active`,
      { active }
    );
  }

  /**
   * Export navigation configuration
   */
  exportNavigation(): Observable<Blob> {
    return this.api.get<Blob>(`${this.baseEndpoint}/export`, {
      responseType: 'blob' as any
    });
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
    );
  }
}
