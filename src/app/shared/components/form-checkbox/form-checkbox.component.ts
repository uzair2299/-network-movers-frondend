import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.css']
})
export class FormCheckboxComponent implements OnInit {
  @Input() label: string = '';
  @Input() description?: string;
  @Input() control!: FormControl;

  checkboxId: string = '';

  ngOnInit() {
    this.checkboxId = `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  }
}
