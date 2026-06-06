import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehicleMake } from '../../models/vehicle-make.model';

export interface VehicleMakeDialogData {
  vehicleMake?: VehicleMake;
  isEdit: boolean;
}

@Component({
  selector: 'app-vehicle-make-dialog',
  templateUrl: './vehicle-make-dialog.component.html',
  styleUrls: ['./vehicle-make-dialog.component.css']
})
export class VehicleMakeDialogComponent implements OnInit {
  vehicleMakeForm: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<VehicleMakeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VehicleMakeDialogData
  ) {
    this.isEdit = data?.isEdit || false;
    
    this.vehicleMakeForm = this.fb.group({
      name: [data?.vehicleMake?.name || '', [Validators.required, Validators.maxLength(100)]],
      code: [data?.vehicleMake?.code || '', [Validators.required, Validators.maxLength(50)]],
      country: [data?.vehicleMake?.country || '', [Validators.required, Validators.maxLength(100)]],
      active: [data?.vehicleMake?.active ?? true]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.vehicleMakeForm.valid) {
      this.dialogRef.close(this.vehicleMakeForm.value);
    } else {
      this.vehicleMakeForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
