import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Resource } from '../../models/rbac.models';

@Component({
  selector: 'app-resource-detail-dialog',
  templateUrl: './resource-detail-dialog.component.html',
  styleUrls: ['./resource-detail-dialog.component.css']
})
export class ResourceDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ResourceDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { resource: Resource }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
