import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-toggle',
  templateUrl: './form-toggle.component.html',
  styleUrls: ['./form-toggle.component.css']
})
export class FormToggleComponent implements OnInit {
  @Input() label: string = '';
  @Input() control!: FormControl;

  toggleId: string = '';

  ngOnInit() {
    this.toggleId = `toggle-${Math.random().toString(36).substring(2, 9)}`;
  }
}
