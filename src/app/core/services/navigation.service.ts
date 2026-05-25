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

  getSidebarMenu(): Observable<SidebarMenuItem[]> {
    return this.api.get<NavigationResponse>('/v1/navigation').pipe(
      map(response => {
        const data = response as NavigationResponse;
        return this.buildSidebarMenu(data?.SIDEBAR ?? []);
      }),
      catchError(() => {
        // Fallback to mock data if API fails
        const mockItems: NavigationItem[] = [
          { id: 1, name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', sortOrder: 1 },
          { id: 2, name: 'Operations', path: '/operations', icon: 'M13 10V3L4 14h7v7l9-11h-7z', sortOrder: 2 },
          { id: 3, name: 'CRM', path: '/crm', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', sortOrder: 3 },
          { id: 4, name: 'Fleet', path: '/fleet', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', sortOrder: 4 },
          { id: 5, name: 'Pricing', path: '/pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', sortOrder: 5 },
          { id: 6, name: 'Support', path: '/support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', sortOrder: 6 },
          { id: 7, name: 'Analytics', path: '/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', sortOrder: 7 },
          { id: 8, name: 'System', path: '/system', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', sortOrder: 8 }
        ];
        return of(this.buildSidebarMenu(mockItems));
      })
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
