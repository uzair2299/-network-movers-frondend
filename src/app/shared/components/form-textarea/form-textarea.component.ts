import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-textarea',
  templateUrl: './form-textarea.component.html',
  styleUrls: ['./form-textarea.component.css']
})
export class FormTextareaComponent implements OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() rows: number = 3;
  @Input() control!: FormControl;

  inputId: string = '';

  ngOnInit() {
    this.inputId = `textarea-${Math.random().toString(36).substring(2, 9)}`;
  }

  get errorMessage(): string | null {
    if (this.control && (this.control.touched || this.control.dirty) && this.control.invalid) {
      const fieldName = this.label.replace(' *', '');
      if (this.control.hasError('required')) return `${fieldName} is required`;
      if (this.control.hasError('minlength')) return `${fieldName} must be at least ${this.control.errors?.['minlength'].requiredLength} characters`;
      if (this.control.hasError('maxlength')) return `${fieldName} cannot exceed ${this.control.errors?.['maxlength'].requiredLength} characters`;
    }
    return null;
  }
}
