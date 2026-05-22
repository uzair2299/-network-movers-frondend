import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { CardComponent } from './components/card/card.component';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { ThemeProviderComponent } from './components/theme-provider/theme-provider.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { HasRoleDirective } from './directives/has-role.directive';

@NgModule({
  declarations: [LoadingSpinnerComponent, CardComponent, ThemeSwitcherComponent, ThemeProviderComponent, DateFormatPipe, HasRoleDirective],
  imports: [CommonModule],
  exports: [CommonModule, LoadingSpinnerComponent, CardComponent, ThemeSwitcherComponent, ThemeProviderComponent, DateFormatPipe, HasRoleDirective]
})
export class SharedModule {}
