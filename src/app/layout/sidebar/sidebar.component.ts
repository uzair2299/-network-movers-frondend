import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../core/services/layout.service';
import { NavigationService, SidebarMenuItem } from '../../core/services/navigation.service';

export interface MenuItem {
  name: string;
  route?: string;
  icon?: string;
  badge?: { text: string; colorClass: string };
  isLabel?: boolean;
  expanded?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isSidebarCollapsed$ = this.layoutService.isSidebarCollapsed$;
  menuItems$: Observable<SidebarMenuItem[]>;

  constructor(public layoutService: LayoutService, private navigationService: NavigationService) {
    this.menuItems$ = this.navigationService.getSidebarMenu();
  }

  toggleSubmenu(item: MenuItem, event: Event) {
    if (item.children) {
      event.preventDefault();
      item.expanded = !item.expanded;
    }
  }

  isSvgIcon(icon?: string): boolean {
    return !!icon && /^[MmLlHhVvCcSsQqTtAaZz]/.test(icon.trim());
  }
}
