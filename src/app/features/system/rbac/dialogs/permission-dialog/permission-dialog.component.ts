import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Permission } from '../../models/rbac.models';
import { RbacService } from '../../services/rbac.service';
import { SelectOption } from '../../../../../shared/components/form-select/form-select.component';

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
  resourceOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    private rbacService: RbacService,
    public dialogRef: MatDialogRef<PermissionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PermissionDialogData
  ) {
    this.isEdit = data?.isEdit || false;
    
    this.permissionForm = this.fb.group({
      name: [data?.permission?.name || '', [Validators.required, Validators.maxLength(100)]],
      code: [data?.permission?.code || '', [Validators.required, Validators.maxLength(50)]],
      description: [data?.permission?.description || '', [Validators.maxLength(255)]],
      resourceId: [data?.permission?.resourceId || null],
      active: [data?.permission?.active ?? true]
    });
  }

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.rbacService.getResources(0, 200, 'name,asc').subscribe({
      next: (res) => {
        this.resourceOptions = [
          { label: 'None (Unassigned)', value: null },
          ...res.content.map(r => ({ label: `${r.name} (${r.code})`, value: r.id }))
        ];
      },
      error: (err) => {
        console.error('Error fetching resources for permissions dropdown', err);
      }
    });
  }

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
