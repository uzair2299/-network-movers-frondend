import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentType } from '../../models/document-type.model';

@Component({
  selector: 'app-document-type-detail-dialog',
  templateUrl: './document-type-detail-dialog.component.html',
  styleUrls: ['./document-type-detail-dialog.component.css']
})
export class DocumentTypeDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DocumentTypeDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { documentType: DocumentType }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
