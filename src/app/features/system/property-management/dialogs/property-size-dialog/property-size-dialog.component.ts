import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropertyService } from '../../services/property.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-property-size-dialog',
  templateUrl: './property-size-dialog.component.html'
})
export class PropertySizeDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  types: {label: string, value: string}[] = [];
  unitTypes = [
    { label: 'Bedroom (BR)', value: 'BR' },
    { label: 'Square Feet (SQFT)', value: 'SQFT' },
    { label: 'Square Meters (SQM)', value: 'SQM' },
    { label: 'Pieces (PCS)', value: 'PCS' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PropertySizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private propertyService: PropertyService,
    private toastService: ToastService
  ) {
    this.isEditMode = !!data.item;
    
    this.form = this.fb.group({
      name: [data.item?.name || '', Validators.required],
      code: [data.item?.code || '', Validators.required],
      typeId: [data.item?.type?.id || '', Validators.required],
      unitType: [data.item?.unitType || 'BR', Validators.required],
      active: [data.item?.active ?? true]
    });
  }

  ngOnInit() {
    this.loadTypes();
  }

  loadTypes() {
    this.propertyService.getTypes().subscribe({
      next: (t) => {
        this.types = t.map(x => ({ label: x.name, value: x.id }));
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    
    const request = this.form.value;
    let request$;

    if (this.isEditMode) {
      request$ = this.propertyService.updateSize(this.data.item.id, request);
    } else {
      request$ = this.propertyService.createSize(request);
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
