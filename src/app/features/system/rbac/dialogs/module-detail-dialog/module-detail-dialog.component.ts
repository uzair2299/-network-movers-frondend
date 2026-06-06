import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Module } from '../../models/rbac.models';

@Component({
  selector: 'app-module-detail-dialog',
  templateUrl: './module-detail-dialog.component.html',
  styleUrls: []
})
export class ModuleDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ModuleDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { module: Module }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
