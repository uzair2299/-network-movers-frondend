import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-detail-dialog',
  templateUrl: './vehicle-detail-dialog.component.html',
  styleUrls: ['./vehicle-detail-dialog.component.css']
})
export class VehicleDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<VehicleDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
