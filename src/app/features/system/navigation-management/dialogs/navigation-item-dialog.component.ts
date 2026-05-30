import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationItemModel, NavigationCreateRequest } from '../models/navigation-item.model';

export interface NavigationItemDialogData {
  item?: NavigationItemModel;
  parentId?: number;
  section: 'PROFILE' | 'SIDEBAR' | 'TOPBAR';
  isEdit: boolean;
}

@Component({
  selector: 'app-navigation-item-dialog',
  templateUrl: './navigation-item-dialog.component.html',
  styleUrls: ['./navigation-item-dialog.component.css']
})
export class NavigationItemDialogComponent implements OnInit {
  form: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  sections = [
    { value: 'PROFILE', label: 'Profile Menu' },
    { value: 'SIDEBAR', label: 'Sidebar Menu' },
    { value: 'TOPBAR', label: 'Top Bar Menu' }
  ];

  commonIcons = [
    'dashboard', 'users', 'settings', 'file-text', 'bar-chart',
    'check-square', 'calendar', 'mail', 'bell', 'lock',
    'user', 'home', 'search', 'trash', 'edit',
    'plus', 'minus', 'arrow-right', 'arrow-left', 'menu'
  ];

  get dialogTitle(): string {
    return this.data.isEdit ? 'Edit Navigation Item' : 'Create Navigation Item';
  }

  get isEditMode(): boolean {
    return this.data.isEdit;
  }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NavigationItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NavigationItemDialogData
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      icon: [''],
      path: [''],
      section: [this.data.section, Validators.required],
      sortOrder: [0, [Validators.required, Validators.min(0)]],
      active: [true]
    });
  }

  ngOnInit(): void {
    if (this.data.isEdit && this.data.item) {
      this.form.patchValue({
        name: this.data.item.name,
        icon: this.data.item.icon || '',
        path: this.data.item.path || '',
        section: this.data.item.section || this.data.section,
        sortOrder: this.data.item.sortOrder ?? 0,
        active: this.data.item.active !== false
      });
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.error = 'Please fill in all required fields correctly';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formValue = this.form.value;
    const request: NavigationCreateRequest = {
      name: formValue.name,
      icon: formValue.icon || undefined,
      path: formValue.path || undefined,
      section: formValue.section,
      sortOrder: formValue.sortOrder,
      active: formValue.active,
      parentId: this.data.parentId
    };

    this.dialogRef.close(request);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  get nameError(): string {
    const control = this.form.get('name');
    if (control?.hasError('required')) {
      return 'Name is required';
    }
    if (control?.hasError('minlength')) {
      return 'Name must be at least 2 characters';
    }
    return '';
  }

  get sortOrderError(): string {
    const control = this.form.get('sortOrder');
    if (control?.hasError('required')) {
      return 'Sort order is required';
    }
    if (control?.hasError('min')) {
      return 'Sort order must be 0 or greater';
    }
    return '';
  }
}
