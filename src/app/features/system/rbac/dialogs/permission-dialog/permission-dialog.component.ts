import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Permission } from '../../models/rbac.models';

export interface PermissionDialogData {
  permission?: Permission;
  isEdit: boolean;
}

@Component({
  selector: 'app-permission-dialog',
  templateUrl: './permission-dialog.component.html',
  styleUrls: []
})
export class PermissionDialogComponent implements OnInit {
  permissionForm: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PermissionDialogData
  ) {
    this.isEdit = data?.isEdit || false;
    
    this.permissionForm = this.fb.group({
      name: [data?.permission?.name || '', [Validators.required, Validators.maxLength(100)]],
      code: [data?.permission?.code || '', [Validators.required, Validators.maxLength(50)]],
      description: [data?.permission?.description || '', [Validators.maxLength(255)]],
      active: [data?.permission?.active ?? true]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.permissionForm.valid) {
      this.dialogRef.close(this.permissionForm.value);
    } else {
      this.permissionForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
