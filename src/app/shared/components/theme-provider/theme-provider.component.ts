import { Component } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-provider',
  templateUrl: './theme-provider.component.html',
  styleUrls: ['./theme-provider.component.css']
})
export class ThemeProviderComponent {
  constructor(public themeService: ThemeService) {}
}
