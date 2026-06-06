import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Permission } from '../../models/rbac.models';

@Component({
  selector: 'app-permission-detail-dialog',
  templateUrl: './permission-detail-dialog.component.html',
  styleUrls: []
})
export class PermissionDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PermissionDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { permission: Permission }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
