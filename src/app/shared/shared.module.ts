import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { CardComponent } from './components/card/card.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { HasRoleDirective } from './directives/has-role.directive';

@NgModule({
  declarations: [LoadingSpinnerComponent, CardComponent, DateFormatPipe, HasRoleDirective],
  imports: [CommonModule],
  exports: [CommonModule, LoadingSpinnerComponent, CardComponent, DateFormatPipe, HasRoleDirective]
})
export class SharedModule {}
