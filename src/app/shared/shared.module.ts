import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { CardComponent } from './components/card/card.component';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher.component';
import { ThemeProviderComponent } from './components/theme-provider/theme-provider.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { HasRoleDirective } from './directives/has-role.directive';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    LoadingSpinnerComponent, 
    CardComponent, 
    ThemeSwitcherComponent, 
    ThemeProviderComponent, 
    DateFormatPipe, 
    HasRoleDirective,
    ToastComponent,
    ConfirmDialogComponent
  ],
  imports: [CommonModule, MatDialogModule],
  exports: [
    CommonModule,
    MatDialogModule, 
    LoadingSpinnerComponent, 
    CardComponent, 
    ThemeSwitcherComponent, 
    ThemeProviderComponent, 
    DateFormatPipe, 
    HasRoleDirective,
    ToastComponent,
    ConfirmDialogComponent
  ]
})
export class SharedModule {}
