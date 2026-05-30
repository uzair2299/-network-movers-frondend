import { Component, Inject, OnInit, HostListener } from '@angular/core';
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
  isSectionDropdownOpen = false;

  sections = [
    { value: 'PROFILE', label: 'Profile Menu' },
    { value: 'SIDEBAR', label: 'Sidebar Menu' },
    { value: 'TOPBAR', label: 'Top Bar Menu' }
  ];



  get dialogTitle(): string {
    return this.data.isEdit ? 'Edit Navigation Item' : 'Create Navigation Item';
  }

  get isEditMode(): boolean {
    return this.data.isEdit;
  }

  getSectionLabel(value: string): string {
    const section = this.sections.find(s => s.value === value);
    return section ? section.label : 'Select Section';
  }

  toggleSectionDropdown(): void {
    this.isSectionDropdownOpen = !this.isSectionDropdownOpen;
  }

  selectSection(value: string): void {
    this.form.patchValue({ section: value });
    this.isSectionDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown-container')) {
      this.isSectionDropdownOpen = false;
    }
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
      parentId: [this.data.parentId || null, [Validators.min(1)]],
      permissionId: [null, [Validators.min(1)]],
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
        parentId: this.data.parentId ?? null,
        permissionId: this.data.item.permissionId ?? null,
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
      parentId: formValue.parentId ? Number(formValue.parentId) : undefined,
      permissionId: formValue.permissionId ? Number(formValue.permissionId) : undefined,
      active: formValue.active
    };

    this.dialogRef.close(request);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  get nameError(): string {
    const control = this.form.get('name');
    if (control && (control.touched || control.dirty)) {
      if (control.hasError('required')) {
        return 'Name is required';
      }
      if (control.hasError('minlength')) {
        return 'Name must be at least 2 characters';
      }
    }
    return '';
  }

  get sortOrderError(): string {
    const control = this.form.get('sortOrder');
    if (control && (control.touched || control.dirty)) {
      if (control.hasError('required')) {
        return 'Sort order is required';
      }
      if (control.hasError('min')) {
        return 'Sort order must be 0 or greater';
      }
    }
    return '';
  }
}
