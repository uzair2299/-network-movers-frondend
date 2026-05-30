import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent implements OnInit {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() control!: FormControl;
  @Input() min?: number;
  @Input() max?: number;

  inputId: string = '';

  ngOnInit() {
    this.inputId = `input-${Math.random().toString(36).substring(2, 9)}`;
  }

  get errorMessage(): string | null {
    if (this.control && (this.control.touched || this.control.dirty) && this.control.invalid) {
      const fieldName = this.label.replace(' *', '');
      if (this.control.hasError('required')) return `${fieldName} is required`;
      if (this.control.hasError('minlength')) return `${fieldName} must be at least ${this.control.errors?.['minlength'].requiredLength} characters`;
      if (this.control.hasError('min')) return `${fieldName} must be ${this.control.errors?.['min'].min} or greater`;
    }
    return null;
  }
}
