import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '../../layout/layout.module';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule
  ]
})
export class MainLayoutComponent {
  isSidebarCollapsed$ = this.layoutService.isSidebarCollapsed$;
  isMobileSidebarOpen$ = this.layoutService.isMobileSidebarOpen$;

  constructor(private layoutService: LayoutService) {}

  closeMobileSidebar() {
    this.layoutService.setMobileSidebarOpen(false);
  }
}
