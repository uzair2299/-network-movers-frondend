import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile-uploader',
  templateUrl: './profile-uploader.component.html',
  styleUrls: ['./profile-uploader.component.css']
})
export class ProfileUploaderComponent implements OnInit {
  @Input() control!: FormControl;
  
  imagePreviewUrl: string | null = null;

  ngOnInit() {
    if (this.control) {
      this.imagePreviewUrl = this.control.value || null;
      this.control.valueChanges.subscribe(value => {
        this.imagePreviewUrl = value || null;
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const resultStr = reader.result as string;
        this.imagePreviewUrl = resultStr;
        this.control.setValue(resultStr);
        this.control.markAsDirty();
        this.control.markAsTouched();
      };
      reader.readAsDataURL(file);
    }
  }

  onRemovePhoto(event: Event) {
    event.stopPropagation();
    this.imagePreviewUrl = null;
    this.control.setValue('');
    this.control.markAsDirty();
    this.control.markAsTouched();
  }
}
