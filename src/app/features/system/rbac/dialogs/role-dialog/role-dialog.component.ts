import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role } from '../../models/rbac.models';

export interface RoleDialogData {
  role?: Role;
  isEdit: boolean;
}

@Component({
  selector: 'app-role-dialog',
  templateUrl: './role-dialog.component.html',
  styleUrls: []
})
export class RoleDialogComponent implements OnInit {
  roleForm: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RoleDialogData
  ) {
    this.isEdit = data?.isEdit || false;
    
    this.roleForm = this.fb.group({
      name: [data?.role?.name || '', [Validators.required, Validators.maxLength(100)]],
      code: [data?.role?.code || '', [Validators.required, Validators.maxLength(50)]],
      description: [data?.role?.description || '', [Validators.maxLength(255)]],
      active: [data?.role?.active ?? true]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.roleForm.valid) {
      this.dialogRef.close(this.roleForm.value);
    } else {
      this.roleForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
