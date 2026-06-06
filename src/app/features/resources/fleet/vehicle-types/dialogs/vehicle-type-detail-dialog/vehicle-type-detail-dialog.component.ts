import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehicleType } from '../../models/vehicle-type.model';

@Component({
  selector: 'app-vehicle-type-detail-dialog',
  templateUrl: './vehicle-type-detail-dialog.component.html',
  styleUrls: ['./vehicle-type-detail-dialog.component.css']
})
export class VehicleTypeDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<VehicleTypeDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vehicleType: VehicleType }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
