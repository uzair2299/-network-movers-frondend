import { Component, Input, Output, EventEmitter } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'ghost-danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth = false;

  @Output() btnClick = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const base = 'app-btn';
    const variantClass = `app-btn-${this.variant}`;
    const sizeClass = `app-btn-${this.size}`;
    const blockClass = this.fullWidth ? 'app-btn-block' : '';
    
    return `${base} ${variantClass} ${sizeClass} ${blockClass}`.trim();
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.btnClick.emit(event);
    } else {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
