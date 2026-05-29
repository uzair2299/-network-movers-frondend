import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { LayoutService } from '../../core/services/layout.service';
import { NavigationService, NavigationItem } from '../../core/services/navigation.service';
import { AuthService } from '../../core/auth/auth.service';
import { JwtService } from '../../core/auth/jwt.service';

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

  navigateTo(path?: string): void {
    this.isProfileOpen = false;
    if (path) {
      this.router.navigateByUrl(path);
    }
  }

  logout(): void {
    this.authService.logout();
    this.isProfileOpen = false;
    this.router.navigate(['/auth']);
  }

  isSvgIcon(icon?: string): boolean {
    return !!icon && (icon.startsWith('M') || icon.startsWith('m'));
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
