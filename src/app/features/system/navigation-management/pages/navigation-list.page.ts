import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NavigationManagementService } from '../services/navigation-management.service';
import { NavigationPermissionService } from '../services/navigation-permission.service';
import { NavigationItemModel, NavigationMenuResponse, NavigationCreateRequest } from '../models/navigation-item.model';
import { PermissionContext } from '../models/permissions.model';
import { NavigationItemDialogComponent, NavigationItemDialogData } from '../dialogs/navigation-item-dialog.component';

@Component({
  selector: 'app-navigation-list',
  templateUrl: './navigation-list.page.html',
  styleUrls: ['./navigation-list.page.css']
})
export class NavigationListPage implements OnInit {
  navigationData: NavigationMenuResponse = {};
  selectedSection: 'PROFILE' | 'SIDEBAR' | 'TOPBAR' = 'SIDEBAR';
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  permissions: PermissionContext;
  selectedItems: Set<number> = new Set();
  expandedItems: Set<number> = new Set();
  isDragging = false;

  sections = [
    { value: 'SIDEBAR', label: 'Sidebar Menu' },
    { value: 'PROFILE', label: 'Profile Menu' },
    { value: 'TOPBAR', label: 'Top Bar Menu' }
  ];

  constructor(
    private navigationService: NavigationManagementService,
    private permissionService: NavigationPermissionService,
    private dialog: MatDialog
  ) {
    this.permissions = this.permissionService.getPermissionContext();
  }

  ngOnInit(): void {
    this.loadNavigationData();
  }

  loadNavigationData(): void {
    this.isLoading = true;
    this.error = null;

    this.navigationService.getAllNavigationItems().subscribe({
      next: (data) => {
        this.navigationData = data;
        
        // Expand top-level items by default
        Object.values(this.navigationData).forEach((sectionItems: any) => {
          if (sectionItems && Array.isArray(sectionItems)) {
            sectionItems.forEach((item: any) => this.expandedItems.add(item.id));
          }
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load navigation items';
        console.error('Error loading navigation:', error);
        this.isLoading = false;
      }
    });
  }

  toggleExpand(item: NavigationItemModel, event: Event): void {
    event.stopPropagation();
    if (this.expandedItems.has(item.id)) {
      this.expandedItems.delete(item.id);
    } else {
      this.expandedItems.add(item.id);
    }
  }

  isExpanded(item: NavigationItemModel): boolean {
    return this.expandedItems.has(item.id);
  }

  asItems(items: any): NavigationItemModel[] {
    return items as NavigationItemModel[];
  }

  getCurrentSectionItems(): NavigationItemModel[] {
    return this.navigationData[this.selectedSection] || [];
  }

  toggleItemActive(item: NavigationItemModel): void {
    const newStatus = !item.active;
    this.navigationService.toggleNavigationItemActive(item.id, newStatus).subscribe({
      next: (updated) => {
        item.active = updated.active;
        this.successMessage = `${item.name} ${updated.active ? 'activated' : 'deactivated'}`;
        this.clearSuccessMessage();
      },
      error: (error) => {
        this.error = `Failed to toggle ${item.name}`;
        console.error('Toggle error:', error);
      }
    });
  }

  deleteItem(item: NavigationItemModel): void {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    this.navigationService.deleteNavigationItem(item.id).subscribe({
      next: () => {
        const items = this.getCurrentSectionItems();
        const index = items.findIndex(i => i.id === item.id);
        if (index > -1) {
          items.splice(index, 1);
        }
        this.successMessage = `${item.name} deleted successfully`;
        this.clearSuccessMessage();
      },
      error: (error) => {
        this.error = `Failed to delete ${item.name}`;
        console.error('Delete error:', error);
      }
    });
  }

  createNewItem(): void {
    const dialogData: NavigationItemDialogData = {
      section: this.selectedSection,
      isEdit: false
    };

    const dialogRef = this.dialog.open(NavigationItemDialogComponent, {
      width: '500px',
      disableClose: false,
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result: NavigationCreateRequest | null) => {
      if (result) {
        this.navigationService.createNavigationItem(result).subscribe({
          next: (newItem) => {
            const items = this.getCurrentSectionItems();
            items.push(newItem);
            items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
            this.successMessage = `${newItem.name} created successfully`;
            this.clearSuccessMessage();
          },
          error: (error) => {
            this.error = `Failed to create navigation item`;
            console.error('Create error:', error);
          }
        });
      }
    });
  }

  editItem(item: NavigationItemModel): void {
    const dialogData: NavigationItemDialogData = {
      item,
      section: (item.section || this.selectedSection) as 'PROFILE' | 'SIDEBAR' | 'TOPBAR',
      isEdit: true
    };

    const dialogRef = this.dialog.open(NavigationItemDialogComponent, {
      width: '500px',
      disableClose: false,
      data: dialogData
    });

    dialogRef.afterClosed().subscribe((result: NavigationCreateRequest | null) => {
      if (result) {
        this.navigationService.updateNavigationItem(item.id, result).subscribe({
          next: (updated) => {
            Object.assign(item, updated);
            this.successMessage = `${updated.name} updated successfully`;
            this.clearSuccessMessage();
          },
          error: (error) => {
            this.error = `Failed to update ${item.name}`;
            console.error('Update error:', error);
          }
        });
      }
    });
  }

  exportNavigation(): void {
    this.isLoading = true;
    this.navigationService.exportNavigation().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `navigation-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isLoading = false;
        this.successMessage = 'Navigation exported successfully';
        this.clearSuccessMessage();
      },
      error: (error) => {
        this.error = 'Failed to export navigation';
        console.error('Export error:', error);
        this.isLoading = false;
      }
    });
  }

  importNavigation(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.isLoading = true;

    this.navigationService.importNavigation(file).subscribe({
      next: (data) => {
        this.navigationData = data;
        this.isLoading = false;
        this.successMessage = 'Navigation imported successfully';
        this.clearSuccessMessage();
        input.value = '';
      },
      error: (error) => {
        this.error = 'Failed to import navigation';
        console.error('Import error:', error);
        this.isLoading = false;
        input.value = '';
      }
    });
  }

  private clearSuccessMessage(): void {
    setTimeout(() => {
      this.successMessage = null;
    }, 3000);
  }

  getIndentLevel(item: NavigationItemModel, depth: number = 0): string {
    return 'indent-' + depth;
  }

  renderMenuTree(items: NavigationItemModel[], depth: number = 0): NavigationItemModel[] {
    return items;
  }

  /* ===== Drag and Drop ===== */
  drop(event: CdkDragDrop<NavigationItemModel[]>): void {
    const items = this.getCurrentSectionItems();

    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(items, event.previousIndex, event.currentIndex);

      // Update sort order
      items.forEach((item, index) => {
        item.sortOrder = (index + 1) * 10;
      });

      // Save to backend
      this.navigationService
        .reorderNavigationItems(this.selectedSection, items)
        .subscribe({
          next: () => {
            this.successMessage = 'Items reordered successfully';
            this.clearSuccessMessage();
          },
          error: (error) => {
            this.error = 'Failed to reorder items';
            console.error('Reorder error:', error);
            this.loadNavigationData(); // Reload to restore original order
          }
        });
    }
  }

  onDragStart(): void {
    this.isDragging = true;
  }

  onDragEnd(): void {
    this.isDragging = false;
  }

  /* ===== Bulk Actions ===== */
  toggleItemSelection(id: number, event: Event): void {
    event.stopPropagation();

    if (this.selectedItems.has(id)) {
      this.selectedItems.delete(id);
    } else {
      this.selectedItems.add(id);
    }
  }

  isItemSelected(id: number): boolean {
    return this.selectedItems.has(id);
  }

  toggleSelectAll(): void {
    const items = this.getCurrentSectionItems();
    const allSelected = items.every(item => this.selectedItems.has(item.id));

    if (allSelected) {
      this.selectedItems.clear();
    } else {
      items.forEach(item => this.selectedItems.add(item.id));
    }
  }

  isAllSelected(): boolean {
    const items = this.getCurrentSectionItems();
    return items.length > 0 && items.every(item => this.selectedItems.has(item.id));
  }

  get hasSelectedItems(): boolean {
    return this.selectedItems.size > 0;
  }

  get selectedCount(): number {
    return this.selectedItems.size;
  }

  bulkActivate(): void {
    if (this.selectedItems.size === 0) return;

    const items = this.getCurrentSectionItems();
    const itemsToUpdate = items
      .filter(item => this.selectedItems.has(item.id))
      .map(item => ({ ...item, active: true }));

    this.navigationService
      .bulkUpdateNavigationItems({ items: itemsToUpdate })
      .subscribe({
        next: (data) => {
          this.navigationData = data;
          this.selectedItems.clear();
          this.successMessage = `${itemsToUpdate.length} items activated`;
          this.clearSuccessMessage();
        },
        error: (error) => {
          this.error = 'Failed to activate items';
          console.error('Bulk activate error:', error);
        }
      });
  }

  bulkDeactivate(): void {
    if (this.selectedItems.size === 0) return;

    const items = this.getCurrentSectionItems();
    const itemsToUpdate = items
      .filter(item => this.selectedItems.has(item.id))
      .map(item => ({ ...item, active: false }));

    this.navigationService
      .bulkUpdateNavigationItems({ items: itemsToUpdate })
      .subscribe({
        next: (data) => {
          this.navigationData = data;
          this.selectedItems.clear();
          this.successMessage = `${itemsToUpdate.length} items deactivated`;
          this.clearSuccessMessage();
        },
        error: (error) => {
          this.error = 'Failed to deactivate items';
          console.error('Bulk deactivate error:', error);
        }
      });
  }

  bulkDelete(): void {
    if (this.selectedItems.size === 0) return;

    const count = this.selectedItems.size;
    if (!confirm(`Are you sure you want to delete ${count} item(s)?`)) {
      return;
    }

    const deletePromises: Promise<void>[] = [];
    this.selectedItems.forEach(id => {
      const promise = this.navigationService.deleteNavigationItem(id).toPromise().then(() => {});
      deletePromises.push(promise);
    });

    Promise.all(deletePromises).then(() => {
      this.loadNavigationData();
      this.selectedItems.clear();
      this.successMessage = `${count} item(s) deleted`;
      this.clearSuccessMessage();
    }).catch(error => {
      this.error = 'Failed to delete some items';
      console.error('Bulk delete error:', error);
    });
  }

  clearSelection(): void {
    this.selectedItems.clear();
  }
}

