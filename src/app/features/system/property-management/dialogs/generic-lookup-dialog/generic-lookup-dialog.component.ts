import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropertyService } from '../../services/property.service';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-generic-lookup-dialog',
  templateUrl: './generic-lookup-dialog.component.html'
})
export class GenericLookupDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  dialogTitle = '';
  type: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GenericLookupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private propertyService: PropertyService,
    private toastService: ToastService
  ) {
    this.type = data.type;
    this.isEditMode = !!data.item;
    this.dialogTitle = this.isEditMode ? `Edit ${this.getTypeLabel()}` : `Create New ${this.getTypeLabel()}`;
    
    this.form = this.fb.group({
      name: [data.item?.name || '', Validators.required],
      code: [data.item?.code || '', Validators.required],
      active: [data.item?.active ?? true]
    });
  }

  ngOnInit() {}

  getTypeLabel() {
    switch(this.type) {
      case 'categories': return 'Category';
      case 'floor': return 'Floor Type';
      case 'building': return 'Building Access';
      case 'parking': return 'Parking Access';
      case 'restrictions': return 'Access Restriction';
      default: return 'Item';
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    
    const request = this.form.value;
    let request$;

    if (this.isEditMode) {
      const id = this.data.item.id;
      switch(this.type) {
        case 'categories': request$ = this.propertyService.updateCategory(id, request); break;
        case 'floor': request$ = this.propertyService.updateFloorType(id, request); break;
        case 'building': request$ = this.propertyService.updateBuildingAccessType(id, request); break;
        case 'parking': request$ = this.propertyService.updateParkingAccessType(id, request); break;
        case 'restrictions': request$ = this.propertyService.updateAccessRestriction(id, request); break;
      }
    } else {
      switch(this.type) {
        case 'categories': request$ = this.propertyService.createCategory(request); break;
        case 'floor': request$ = this.propertyService.createFloorType(request); break;
        case 'building': request$ = this.propertyService.createBuildingAccessType(request); break;
        case 'parking': request$ = this.propertyService.createParkingAccessType(request); break;
        case 'restrictions': request$ = this.propertyService.createAccessRestriction(request); break;
      }
    }

    request$?.subscribe({
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
