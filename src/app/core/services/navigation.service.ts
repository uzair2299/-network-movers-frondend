import { Injectable } from '@angular/core';
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

  getSidebarMenu(): Observable<SidebarMenuItem[]> {
    return this.api.get<NavigationResponse>('/v1/navigation').pipe(
      map(response => this.buildSidebarMenu(response?.SIDEBAR ?? [])),
      catchError(() => of([]))
    );
  }

  private buildSidebarMenu(items: NavigationItem[]): SidebarMenuItem[] {
    return (items ?? [])
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map(item => this.mapToMenuItem(item));
  }

  private mapToMenuItem(item: NavigationItem): SidebarMenuItem {
    return {
      name: item.name,
      route: item.path,
      icon: item.icon,
      expanded: false,
      children: item.children
        ? item.children
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map(child => this.mapToMenuItem(child))
        : undefined
    };
  }
}
