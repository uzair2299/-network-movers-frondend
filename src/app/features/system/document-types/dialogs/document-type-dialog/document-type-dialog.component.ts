import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentType } from '../../models/document-type.model';

export interface DocumentTypeDialogData {
  documentType?: DocumentType;
  isEdit: boolean;
}

@Component({
  selector: 'app-document-type-dialog',
  templateUrl: './document-type-dialog.component.html',
  styleUrls: ['./document-type-dialog.component.css']
})
export class DocumentTypeDialogComponent implements OnInit {
  docTypeForm: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DocumentTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentTypeDialogData
  ) {
    this.isEdit = data?.isEdit || false;
    
    this.docTypeForm = this.fb.group({
      name: [data?.documentType?.name || '', [Validators.required, Validators.maxLength(100)]],
      code: [data?.documentType?.code || '', [Validators.required, Validators.maxLength(50)]],
      description: [data?.documentType?.description || '', [Validators.maxLength(255)]],
      active: [data?.documentType?.active ?? true],
      mandatory: [data?.documentType?.mandatory ?? true],
      expiryRequired: [data?.documentType?.expiryRequired ?? false]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.docTypeForm.valid) {
      this.dialogRef.close(this.docTypeForm.value);
    } else {
      this.docTypeForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
