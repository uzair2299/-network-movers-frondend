import { Component, Input, HostListener, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.css']
})
export class FormSelectComponent {
  @Input() label: string = '';
  @Input() options: SelectOption[] = [];
  @Input() control!: FormControl;
  @Input() placeholder: string = 'Select an option';
  @Input() required: boolean = false;

  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  get selectedLabel(): string {
    if (!this.control) return this.placeholder;
    const selectedOption = this.options.find(opt => opt.value === this.control.value);
    return selectedOption ? selectedOption.label : this.placeholder;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectOption(value: any): void {
    if (this.control) {
      this.control.setValue(value);
      this.control.markAsDirty();
      this.control.markAsTouched();
    }
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
  
  get errorMessage(): string | null {
    if (this.control && (this.control.touched || this.control.dirty) && this.control.invalid) {
      const fieldName = this.label.replace(' *', '');
      if (this.control.hasError('required')) return `${fieldName} is required`;
    }
    return null;
  }
}
