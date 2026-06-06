import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role } from '../../models/rbac.models';
import { RbacService } from '../../services/rbac.service';
import { SelectOption } from '../../../../../shared/components/form-select/form-select.component';

@Component({
  selector: 'app-user-role-dialog',
  templateUrl: './user-role-dialog.component.html',
  styleUrls: []
})
export class UserRoleDialogComponent implements OnInit {
  userRoleForm: FormGroup;
  roleOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    private rbacService: RbacService,
    public dialogRef: MatDialogRef<UserRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userRoleForm = this.fb.group({
      userId: ['', [Validators.required, Validators.pattern(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)]],
      roleId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.rbacService.getRoles(0, 200, 'name,asc').subscribe({
      next: (res) => {
        this.roleOptions = res.content.map(r => ({ label: `${r.name} (${r.code})`, value: r.id }));
      }
    });
  }

  onSubmit(): void {
    if (this.userRoleForm.valid) {
      this.dialogRef.close(this.userRoleForm.value);
    } else {
      this.userRoleForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
