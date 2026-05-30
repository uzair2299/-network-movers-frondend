import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { MatDialog } from '@angular/material/dialog';
import { GenericLookupDialogComponent } from '../../dialogs/generic-lookup-dialog/generic-lookup-dialog.component';
import { PropertyTypeDialogComponent } from '../../dialogs/property-type-dialog/property-type-dialog.component';
import { PropertySizeDialogComponent } from '../../dialogs/property-size-dialog/property-size-dialog.component';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../../../shared/services/toast.service';

type ActiveTab = 'categories' | 'types' | 'sizes' | 'floor' | 'building' | 'parking' | 'restrictions';

@Component({
  selector: 'app-property-config',
  templateUrl: './property-config.page.html',
  styleUrls: ['./property-config.page.css']
})
export class PropertyConfigPage implements OnInit {
  activeTab: ActiveTab = 'categories';
  
  data: any[] = [];
  isLoading = false;

  searchQuery = '';
  sortColumn: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private propertyService: PropertyService,
    private dialog: MatDialog,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const tab = params.get('tab') as ActiveTab;
      if (tab) {
        this.activeTab = tab;
      }
      this.searchQuery = '';
      this.loadData();
    });
  }

  setTab(tab: ActiveTab) {
    this.router.navigate(['../', tab], { relativeTo: this.route });
  }

  loadData() {
    this.isLoading = true;
    let request$;
    switch (this.activeTab) {
      case 'categories': request$ = this.propertyService.getCategories(); break;
      case 'types': request$ = this.propertyService.getTypes(); break;
      case 'sizes': request$ = this.propertyService.getSizes(); break;
      case 'floor': request$ = this.propertyService.getFloorTypes(); break;
      case 'building': request$ = this.propertyService.getBuildingAccessTypes(); break;
      case 'parking': request$ = this.propertyService.getParkingAccessTypes(); break;
      case 'restrictions': request$ = this.propertyService.getAccessRestrictions(); break;
    }

    request$.subscribe({
      next: (res) => {
        this.data = res;
        this.isLoading = false;
      },
      error: () => {
        this.toastService.showError('Failed to load data');
        this.isLoading = false;
      }
    });
  }

  openCreateDialog() {
    this.openEditDialog(null);
  }

  openEditDialog(item: any) {
    let dialogRef;
    let config = {
      width: '500px',
      data: { item, type: this.activeTab },
      panelClass: 'custom-dialog-container',
      autoFocus: false
    };

    if (this.activeTab === 'types') {
      dialogRef = this.dialog.open(PropertyTypeDialogComponent, config);
    } else if (this.activeTab === 'sizes') {
      dialogRef = this.dialog.open(PropertySizeDialogComponent, config);
    } else {
      dialogRef = this.dialog.open(GenericLookupDialogComponent, config);
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
        this.toastService.showSuccess(`Saved successfully!`);
      }
    });
  }

  deleteItem(item: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Item',
        message: `Are you sure you want to delete ${item.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'warning'
      },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let request$;
        switch (this.activeTab) {
          case 'categories': request$ = this.propertyService.deleteCategory(item.id); break;
          case 'types': request$ = this.propertyService.deleteType(item.id); break;
          case 'sizes': request$ = this.propertyService.deleteSize(item.id); break;
          case 'floor': request$ = this.propertyService.deleteFloorType(item.id); break;
          case 'building': request$ = this.propertyService.deleteBuildingAccessType(item.id); break;
          case 'parking': request$ = this.propertyService.deleteParkingAccessType(item.id); break;
          case 'restrictions': request$ = this.propertyService.deleteAccessRestriction(item.id); break;
        }

        request$.subscribe({
          next: () => {
            this.toastService.showSuccess('Deleted successfully');
            this.loadData();
          },
          error: () => this.toastService.showError('Failed to delete item')
        });
      }
    });
  }

  getTabTitle() {
    switch(this.activeTab) {
      case 'categories': return 'Property Categories';
      case 'types': return 'Property Types';
      case 'sizes': return 'Property Sizes';
      case 'floor': return 'Floor Types';
      case 'building': return 'Building Access';
      case 'parking': return 'Parking Access';
      case 'restrictions': return 'Access Restrictions';
    }
  }

  getFilteredAndSortedData() {
    let result = [...this.data];

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name?.toLowerCase().includes(q) || 
        item.code?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      if (this.sortColumn === 'categoryName') {
        valA = a.category?.name || '';
        valB = b.category?.name || '';
      } else if (this.sortColumn === 'typeName') {
        valA = a.type?.name || '';
        valB = b.type?.name || '';
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }
}
