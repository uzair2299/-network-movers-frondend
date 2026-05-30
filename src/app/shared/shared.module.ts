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
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { DropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { ButtonComponent } from './components/button/button.component';
import { FormCheckboxComponent } from './components/form-checkbox/form-checkbox.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoadingSpinnerComponent, 
    CardComponent, 
    ThemeSwitcherComponent, 
    ThemeProviderComponent, 
    DateFormatPipe, 
    HasRoleDirective,
    ToastComponent,
    ConfirmDialogComponent,
    PageHeaderComponent,
    SearchBarComponent,
    FormInputComponent,
    FormSelectComponent,
    DropdownMenuComponent,
    ButtonComponent,
    FormCheckboxComponent
  ],
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule],
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
    ConfirmDialogComponent,
    PageHeaderComponent,
    SearchBarComponent,
    FormInputComponent,
    FormSelectComponent,
    DropdownMenuComponent,
    ButtonComponent,
    FormCheckboxComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule {}
