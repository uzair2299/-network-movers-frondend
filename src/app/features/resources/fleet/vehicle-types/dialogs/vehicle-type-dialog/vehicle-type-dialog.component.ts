import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehicleType } from '../../models/vehicle-type.model';

export interface VehicleTypeDialogData {
  vehicleType?: VehicleType;
  isEdit: boolean;
}

@Component({
  selector: 'app-vehicle-type-dialog',
  templateUrl: './vehicle-type-dialog.component.html',
  styleUrls: ['./vehicle-type-dialog.component.css']
})
export class VehicleTypeDialogComponent implements OnInit {
  vehicleTypeForm: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VehicleTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VehicleTypeDialogData
  ) {
    this.isEdit = data?.isEdit || false;
    
    this.vehicleTypeForm = this.fb.group({
      name: [data?.vehicleType?.name || '', [Validators.required, Validators.maxLength(100)]],
      code: [data?.vehicleType?.code || '', [Validators.required, Validators.maxLength(50)]],
      description: [data?.vehicleType?.description || '', [Validators.maxLength(255)]],
      active: [data?.vehicleType?.active ?? true]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.vehicleTypeForm.valid) {
      this.dialogRef.close(this.vehicleTypeForm.value);
    } else {
      this.vehicleTypeForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
