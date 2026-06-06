import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'code' | 'status' | 'actions' | 'custom';
  sortable?: boolean;
  valueGetter?: (item: any) => any;
  bold?: boolean;
  actionsDropdown?: boolean;
  dropdownItems?: any[];
}

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() sortColumn: string = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() isLoading: boolean = false;
  
  // Empty state inputs
  @Input() emptyIcon: string = '📋';
  @Input() emptyTitle: string = 'No Data Found';
  @Input() emptyMessage: string = 'No results match your criteria.';

  @Output() sort = new EventEmitter<string>();
  @Output() action = new EventEmitter<{ action: string, item: any }>();

  getValue(item: any, column: TableColumn): any {
    if (column.valueGetter) {
      return column.valueGetter(item);
    }
    return item[column.key];
  }

  onSort(column: TableColumn) {
    if (column.sortable) {
      this.sort.emit(column.key);
    }
  }

  onAction(action: string, item: any) {
    this.action.emit({ action, item });
  }
}
