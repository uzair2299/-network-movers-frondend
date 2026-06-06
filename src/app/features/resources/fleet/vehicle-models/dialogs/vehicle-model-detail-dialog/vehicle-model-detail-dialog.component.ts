import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehicleModel } from '../../models/vehicle-model.model';

@Component({
  selector: 'app-vehicle-model-detail-dialog',
  templateUrl: './vehicle-model-detail-dialog.component.html',
  styleUrls: ['./vehicle-model-detail-dialog.component.css']
})
export class VehicleModelDetailDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<VehicleModelDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VehicleModel
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
