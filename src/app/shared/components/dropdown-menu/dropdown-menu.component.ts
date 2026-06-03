import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css']
})
export class DropdownMenuComponent {
  @Input() label: string = 'Options';
  @Input() items: DropdownMenuItem[] = [];
  @Input() iconOnly: boolean = false;
  @Output() itemSelected = new EventEmitter<string>();

  isOpen = false;

  constructor(private elementRef: ElementRef, private sanitizer: DomSanitizer) {}

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectItem(id: string): void {
    this.itemSelected.emit(id);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
