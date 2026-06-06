import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Resource } from '../../models/rbac.models';

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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResourceDialogData
  ) {
    this.isEdit = data?.isEdit || false;
    
    this.resourceForm = this.fb.group({
      name: [data?.resource?.name || '', [Validators.required, Validators.maxLength(100)]],
      code: [data?.resource?.code || '', [Validators.required, Validators.maxLength(50)]],
      description: [data?.resource?.description || '', [Validators.maxLength(255)]],
      active: [data?.resource?.active ?? true]
    });
  }

  ngOnInit(): void {}

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
