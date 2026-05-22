import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: '<section class="card"><ng-content></ng-content></section>',
  styles: ['.card { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(15,23,42,0.05); }']
})
export class CardComponent {}
