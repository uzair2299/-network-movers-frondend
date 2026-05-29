import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface NavigationItem {
  id: number;
  name: string;
  icon?: string;
  path?: string;
  sortOrder?: number;
  children?: NavigationItem[];
}

export interface NavigationResponse {
  PROFILE?: NavigationItem[];
  SIDEBAR?: NavigationItem[];
  TOPBAR?: NavigationItem[];
}

export interface SidebarMenuItem {
  name: string;
  route?: string;
  icon?: string;
  expanded?: boolean;
  children?: SidebarMenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private api: ApiService) {}

  /**
   * Get sidebar menu - supports up to 3 levels of nesting
   * Level 1: Main categories (Dashboard, CRM, Operations, etc.)
   * Level 2: Sub-categories (Leads, Customers, Bookings, etc.)
   * Level 3: Detailed items (All Leads, New Leads, etc.)
   */
  getSidebarMenu(maxDepth: number = 3): Observable<SidebarMenuItem[]> {
    return this.api.get<NavigationResponse>('/navigation').pipe(
      map(response => {
        const data = response instanceof HttpResponse ? response.body : response;
        return this.buildSidebarMenu(data?.SIDEBAR ?? [], maxDepth);
      }),
      catchError(() => of([]))
    );
  }

  /**
   * Get only 2 levels of nesting (parent + children) - for compact sidebar
   */
  getSidebarMenuCompact(): Observable<SidebarMenuItem[]> {
    return this.getSidebarMenu(2);
  }

  /**
   * Get unlimited nesting levels - for expandable tree view
   */
  getSidebarMenuFull(): Observable<SidebarMenuItem[]> {
    return this.getSidebarMenu(999);
  }

  getProfileMenu(): Observable<NavigationItem[]> {
    return this.api.get<NavigationResponse>('/navigation').pipe(
      map(response => {
        const data = response instanceof HttpResponse ? response.body : response;
        return (data?.PROFILE ?? []).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      }),
      catchError(() => of([]))
    );
  }

  private buildSidebarMenu(items: NavigationItem[], maxDepth: number = 3): SidebarMenuItem[] {
    return (items ?? [])
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(item => this.mapToMenuItem(item, 1, maxDepth));
  }

  /**
   * Calculate the maximum nesting depth in the navigation structure
   * Useful for determining optimal UI display strategy
   */
  getMaxNestingDepth(items: NavigationItem[]): number {
    if (!items || items.length === 0) return 0;
    
    let maxDepth = 1;
    for (const item of items) {
      if (item.children && item.children.length > 0) {
        const childDepth = 1 + this.getMaxNestingDepth(item.children);
        maxDepth = Math.max(maxDepth, childDepth);
      }
    }
    return maxDepth;
  }

  /**
   * Recursively map NavigationItem to SidebarMenuItem with depth limiting
   * @param item The navigation item to map
   * @param currentDepth Current depth level (1-based)
   * @param maxDepth Maximum depth to display (default: 3 levels)
   */
  private mapToMenuItem(item: NavigationItem, currentDepth: number = 1, maxDepth: number = 3): SidebarMenuItem {
    const isMaxDepth = currentDepth >= maxDepth;
    
    return {
      name: item.name,
      route: item.path,
      icon: item.icon,
      expanded: false,
      // Only include children if we haven't reached max depth
      children: !isMaxDepth && item.children
        ? item.children
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map(child => this.mapToMenuItem(child, currentDepth + 1, maxDepth))
        : undefined
    };
  }
}
