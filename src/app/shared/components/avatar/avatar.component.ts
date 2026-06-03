import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnChanges {
  @Input() firstName: string | null | undefined = '';
  @Input() lastName: string | null | undefined = '';
  @Input() size: number = 24;

  initials: string = '';

  ngOnChanges(): void {
    const firstInitial = this.firstName?.charAt(0) || 'U';
    const lastInitial = this.lastName?.charAt(0) || '';
    this.initials = `${firstInitial}${lastInitial}`.toUpperCase();
  }
}
