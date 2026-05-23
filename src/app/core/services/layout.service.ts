import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private sidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
  isSidebarCollapsed$ = this.sidebarCollapsedSubject.asObservable();

  private mobileSidebarOpenSubject = new BehaviorSubject<boolean>(false);
  isMobileSidebarOpen$ = this.mobileSidebarOpenSubject.asObservable();

  constructor() {}

  toggleSidebar(): void {
    this.sidebarCollapsedSubject.next(!this.sidebarCollapsedSubject.value);
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.sidebarCollapsedSubject.next(collapsed);
  }

  toggleMobileSidebar(): void {
    this.mobileSidebarOpenSubject.next(!this.mobileSidebarOpenSubject.value);
  }

  setMobileSidebarOpen(open: boolean): void {
    this.mobileSidebarOpenSubject.next(open);
  }
}
