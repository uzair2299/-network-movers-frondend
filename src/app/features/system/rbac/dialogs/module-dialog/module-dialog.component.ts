import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Module } from '../../models/rbac.models';

export interface ModuleDialogData {
  module?: Module;
  isEdit: boolean;
}

@Component({
  selector: 'app-module-dialog',
  templateUrl: './module-dialog.component.html',
  styleUrls: ['./module-dialog.component.css']
})
export class ModuleDialogComponent implements OnInit {
  moduleForm: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModuleDialogData
  ) {
    this.isEdit = data?.isEdit || false;
    
    this.moduleForm = this.fb.group({
      name: [data?.module?.name || '', [Validators.required, Validators.maxLength(100)]],
      code: [data?.module?.code || '', [Validators.required, Validators.maxLength(50)]],
      description: [data?.module?.description || '', [Validators.maxLength(255)]],
      active: [data?.module?.active ?? true]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.moduleForm.valid) {
      this.dialogRef.close(this.moduleForm.value);
    } else {
      this.moduleForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
