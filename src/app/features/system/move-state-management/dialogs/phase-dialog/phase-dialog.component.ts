import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovePhaseResponse } from '../../models/move-state.model';

export interface PhaseDialogData {
  phase?: MovePhaseResponse;
}

@Component({
  selector: 'app-phase-dialog',
  templateUrl: './phase-dialog.component.html',
  styleUrls: ['./phase-dialog.component.css']
})
export class PhaseDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PhaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PhaseDialogData
  ) {
    this.isEditMode = !!data.phase;
    
    this.form = this.fb.group({
      name: [data.phase?.name || '', Validators.required],
      code: [data.phase?.code || '', Validators.required],
      sequenceNo: [data.phase?.sequenceNo || 0, [Validators.required, Validators.min(0)]],
      active: [data.phase?.active ?? true]
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
