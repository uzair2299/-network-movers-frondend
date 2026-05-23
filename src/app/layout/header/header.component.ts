import { Component } from '@angular/core';

import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public layoutService: LayoutService) {}
}
