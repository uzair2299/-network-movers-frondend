import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css']
})
export class StatusBadgeComponent {
  @Input() status: boolean = false;
  @Input() activeText: string = 'Active';
  @Input() inactiveText: string = 'Inactive';
}
