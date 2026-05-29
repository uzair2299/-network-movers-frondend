import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { LayoutService } from '../../core/services/layout.service';
import { NavigationService, NavigationItem } from '../../core/services/navigation.service';
import { AuthService } from '../../core/auth/auth.service';
import { JwtService } from '../../core/auth/jwt.service';

// SVG path map for named icon strings returned by the navigation API
const ICON_SVG_MAP: Record<string, string> = {
  'user-profile':   'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  'settings-gear':  'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  'sign-out':       'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  // Generic fallbacks for common icon names used across SIDEBAR etc.
  'user':           'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  'settings':       'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  'logout':         'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  profileMenuItems: NavigationItem[] = [];
  isProfileOpen = false;
  userName: string | null = null;
  userEmail: string | null = null;

  constructor(
    public layoutService: LayoutService,
    private navigationService: NavigationService,
    private authService: AuthService,
    private jwtService: JwtService,
    private router: Router,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.userName = this.jwtService.getUserName();
    this.userEmail = this.jwtService.getUserEmail();

    this.navigationService.getProfileMenu().subscribe(items => {
      this.profileMenuItems = items;
    });
  }

  toggleProfileDropdown(): void {
    this.isProfileOpen = !this.isProfileOpen;
  }

  /** Handle click on any profile menu item from the API */
  handleProfileItem(item: NavigationItem): void {
    this.isProfileOpen = false;
    if (item.path === '/logout') {
      this.logout();
    } else if (item.path) {
      this.router.navigateByUrl(item.path);
    }
  }

  logout(): void {
    this.authService.logout();
    this.navigationService.clearCache();
    this.isProfileOpen = false;
    this.router.navigate(['/auth']);
  }

  /** Returns true if the item is the logout action (either by path or icon name) */
  isLogoutItem(item: NavigationItem): boolean {
    return item.path === '/logout' || item.icon === 'sign-out';
  }

  /** Resolves named icon (e.g. "user-profile") to its SVG path string */
  getIconPath(icon?: string): string | null {
    if (!icon) return null;
    // Already an SVG path (starts with M command)
    if (/^[Mm]/.test(icon)) return icon;
    return ICON_SVG_MAP[icon] ?? null;
  }

  getUserInitials(): string {
    if (!this.userName) return 'U';
    return this.userName
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isProfileOpen = false;
    }
  }
}
