import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropertyService } from '../../services/property.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-property-type-dialog',
  templateUrl: './property-type-dialog.component.html',
  styleUrls: ['./property-type-dialog.component.css']
})
export class PropertyTypeDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  categories: {label: string, value: string}[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PropertyTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private propertyService: PropertyService,
    private toastService: ToastService
  ) {
    this.isEditMode = !!data.item;
    
    this.form = this.fb.group({
      name: [data.item?.name || '', Validators.required],
      code: [data.item?.code || '', Validators.required],
      categoryId: [data.item?.category?.id || '', Validators.required],
      active: [data.item?.active ?? true]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.propertyService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats.map(c => ({ label: c.name, value: c.id }));
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    
    const request = this.form.value;
    let request$;

    if (this.isEditMode) {
      request$ = this.propertyService.updateType(this.data.item.id, request);
    } else {
      request$ = this.propertyService.createType(request);
    }

    request$.subscribe({
      next: (res) => this.dialogRef.close(res),
      error: () => {
        this.toastService.showError('Operation failed');
        this.isSubmitting = false;
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
