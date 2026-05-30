import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-divider',
  template: `
    <hr class="app-divider" 
        [ngClass]="{'vertical': vertical}" 
        [style.margin]="margin">
  `,
  styles: [`
    .app-divider {
      border: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      margin: 1rem 0;
      width: 100%;
    }
    .app-divider.vertical {
      border-bottom: 0;
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      margin: 0 1rem;
      height: 100%;
      width: 0;
    }
  `]
})
export class DividerComponent {
  @Input() vertical = false;
  @Input() margin = '1rem 0';
}
