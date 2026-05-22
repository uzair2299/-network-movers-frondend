import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: '<div class="spinner"></div>',
  styles: ['.spinner { width: 32px; height: 32px; border: 4px solid #d1d5db; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }']
})
export class LoadingSpinnerComponent {}
