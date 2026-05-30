import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MoveStatusResponse } from '../../models/move-state.model';

export interface StatusDialogData {
  status?: MoveStatusResponse;
  phaseId: string;
}

@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.css']
})
export class StatusDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StatusDialogData
  ) {
    this.isEditMode = !!data.status;
    
    this.form = this.fb.group({
      name: [data.status?.name || '', Validators.required],
      code: [data.status?.code || '', Validators.required],
      description: [data.status?.description || ''],
      sequenceNo: [data.status?.sequenceNo || 0, [Validators.required, Validators.min(0)]],
      colorCode: [data.status?.colorCode || '#3498db', Validators.required],
      phaseId: [data.phaseId, Validators.required],
      isFinal: [data.status?.isFinal ?? false],
      customerVisible: [data.status?.customerVisible ?? true],
      internalOnly: [data.status?.internalOnly ?? false],
      active: [data.status?.active ?? true]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
