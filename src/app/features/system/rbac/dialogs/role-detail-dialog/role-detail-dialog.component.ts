import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role } from '../../models/rbac.models';

@Component({
  selector: 'app-role-detail-dialog',
  templateUrl: './role-detail-dialog.component.html',
  styleUrls: []
})
export class RoleDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RoleDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { role: Role }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
