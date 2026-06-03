import { Component, EventEmitter, Input, OnChanges, Output, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {
  @Input() totalElements: number = 0;
  @Input() pageSize: number = 20;
  @Input() currentPage: number = 0;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() sizeChange = new EventEmitter<number>();

  totalPages: number = 0;
  pages: number[] = [];
  isPageSizeOpen: boolean = false;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(): void {
    this.calculatePages();
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  calculatePages(): void {

    this.totalPages = Math.ceil(this.totalElements / this.pageSize);
    
    let start = Math.max(0, this.currentPage - 2);
    let end = Math.min(this.totalPages - 1, start + 4);
    
    if (end - start < 4) {
      start = Math.max(0, end - 4);
    }
    
    this.pages = [];
    for (let i = start; i <= end; i++) {
      this.pages.push(i);
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onSizeChange(size: number): void {
    this.sizeChange.emit(size);
  }

  togglePageSize(): void {
    this.isPageSizeOpen = !this.isPageSizeOpen;
  }

  setPageSize(size: number): void {
    this.pageSize = size;
    this.isPageSizeOpen = false;
    this.onSizeChange(size);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isPageSizeOpen = false;
    }
  }
}
