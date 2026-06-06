import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role } from '../../models/role.model';

@Component({
  selector: 'app-role-detail-dialog',
  templateUrl: './role-detail-dialog.component.html',
  styleUrls: ['./role-detail-dialog.component.css']
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
