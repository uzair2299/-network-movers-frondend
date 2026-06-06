import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.isEditMode = !!data;
    const initialPhoto = data?.profile?.profilePictureUrl || data?.profilePictureUrl || '';

    this.form = this.fb.group({
      username: [data?.username || '', [Validators.required, Validators.minLength(3)]],
      email: [data?.email || '', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      enabled: [data ? data.enabled : true],
      firstName: [data?.profile?.firstName || '', Validators.required],
      lastName: [data?.profile?.lastName || '', Validators.required],
      phoneNumber: [data?.profile?.phoneNumber || ''],
      profilePictureUrl: [initialPhoto],
      address: [data?.profile?.address || '']
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.form.valid) {
      const formValue = { ...this.form.value };
      if (this.isEditMode && !formValue.password) {
        delete formValue.password;
      }
      this.dialogRef.close(formValue);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
