import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehicleMake } from '../../models/vehicle-make.model';

@Component({
  selector: 'app-vehicle-make-detail-dialog',
  templateUrl: './vehicle-make-detail-dialog.component.html',
  styleUrls: ['./vehicle-make-detail-dialog.component.css']
})
export class VehicleMakeDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<VehicleMakeDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicleMake: VehicleMake }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
