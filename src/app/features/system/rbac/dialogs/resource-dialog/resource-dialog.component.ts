import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Resource } from '../../models/rbac.models';
import { RbacService } from '../../services/rbac.service';
import { SelectOption } from '../../../../../shared/components/form-select/form-select.component';

export interface ResourceDialogData {
  resource?: Resource;
  isEdit: boolean;
}

@Component({
  selector: 'app-resource-dialog',
  templateUrl: './resource-dialog.component.html',
  styleUrls: []
})
export class ResourceDialogComponent implements OnInit {
  resourceForm: FormGroup;
  isEdit: boolean;
  moduleOptions: SelectOption[] = [];

  constructor(
    private fb: FormBuilder,
    private rbacService: RbacService,
    public dialogRef: MatDialogRef<ResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResourceDialogData
  ) {
    this.isEdit = data?.isEdit || false;
    
    this.resourceForm = this.fb.group({
      name: [data?.resource?.name || '', [Validators.required, Validators.maxLength(100)]],
      code: [data?.resource?.code || '', [Validators.required, Validators.maxLength(50)]],
      description: [data?.resource?.description || '', [Validators.maxLength(255)]],
      moduleId: [data?.resource?.moduleId || null],
      active: [data?.resource?.active ?? true]
    });
  }

  ngOnInit(): void {
    this.loadModules();
  }

  loadModules(): void {
    this.rbacService.getModules(0, 200, 'name,asc').subscribe({
      next: (res) => {
        this.moduleOptions = [
          { label: 'None (Unassigned)', value: null },
          ...res.content.map(m => ({ label: m.name, value: m.id }))
        ];
      },
      error: (err) => {
        console.error('Error fetching modules for resources dropdown', err);
      }
    });
  }

  onSubmit(): void {
    if (this.resourceForm.valid) {
      this.dialogRef.close(this.resourceForm.value);
    } else {
      this.resourceForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
