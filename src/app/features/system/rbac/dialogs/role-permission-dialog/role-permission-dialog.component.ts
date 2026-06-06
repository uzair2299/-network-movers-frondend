import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RbacService } from '../../services/rbac.service';
import { SelectOption } from '../../../../../shared/components/form-select/form-select.component';

export interface RolePermissionDialogData {
  preselectedRoleId?: string;
}

@Component({
  selector: 'app-role-permission-dialog',
  templateUrl: './role-permission-dialog.component.html',
  styleUrls: []
})
export class RolePermissionDialogComponent implements OnInit {
  form: FormGroup;
  roleOptions: SelectOption[] = [];
  permissionOptions: SelectOption[] = [];
  isLoadingRoles = false;
  isLoadingPermissions = false;

  constructor(
    private fb: FormBuilder,
    private rbacService: RbacService,
    public dialogRef: MatDialogRef<RolePermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RolePermissionDialogData
  ) {
    this.form = this.fb.group({
      roleId: [data?.preselectedRoleId || null, Validators.required],
      permissionId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    this.isLoadingRoles = true;
    this.rbacService.getRoles(0, 200, 'name,asc').subscribe({
      next: (res) => {
        this.roleOptions = res.content.map(r => ({ label: `${r.name} (${r.code})`, value: r.id }));
        this.isLoadingRoles = false;
      },
      error: () => { this.isLoadingRoles = false; }
    });
  }

  loadPermissions(): void {
    this.isLoadingPermissions = true;
    this.rbacService.getPermissions(0, 500, 'name,asc').subscribe({
      next: (res) => {
        this.permissionOptions = res.content.map(p => ({ label: `${p.name} (${p.code})`, value: p.id }));
        this.isLoadingPermissions = false;
      },
      error: () => { this.isLoadingPermissions = false; }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
