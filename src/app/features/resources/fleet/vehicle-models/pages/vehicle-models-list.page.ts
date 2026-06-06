import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableColumn } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { VehicleModelsService } from '../services/vehicle-models.service';
import { VehicleModel } from '../models/vehicle-model.model';
import { VehicleModelDialogComponent } from '../dialogs/vehicle-model-dialog/vehicle-model-dialog.component';
import { VehicleModelDetailDialogComponent } from '../dialogs/vehicle-model-detail-dialog/vehicle-model-detail-dialog.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-vehicle-models-list',
  templateUrl: './vehicle-models-list.page.html',
  styleUrls: ['./vehicle-models-list.page.css']
})
export class VehicleModelsListPage implements OnInit {
  vehicleModels: VehicleModel[] = [];
  isLoading = true;
  searchQuery = '';
  
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  sortColumn = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text', sortable: true, bold: true },
    { key: 'code', label: 'Code', type: 'code', sortable: true },
    { key: 'make', label: 'Make', type: 'text', sortable: false, valueGetter: (item: VehicleModel) => item.make?.name },
    { key: 'vehicleType', label: 'Type', type: 'text', sortable: false, valueGetter: (item: VehicleModel) => item.vehicleType?.name },
    { key: 'capacityKg', label: 'Capacity (kg)', type: 'text', sortable: true },
    { key: 'active', label: 'Status', type: 'status', sortable: true },
    { 
      key: 'actions', 
      label: 'Actions', 
      type: 'actions', 
      sortable: false,
      actionsDropdown: true,
      dropdownItems: [
        { id: 'view', label: 'View Details' },
        { id: 'edit', label: 'Edit Model' },
        { id: 'delete', label: 'Delete Model' }
      ]
    }
  ];

  moreActions = [
    { label: 'Export to CSV', action: 'export' },
    { label: 'Refresh List', action: 'refresh' }
  ];

  constructor(
    private vehicleModelsService: VehicleModelsService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadVehicleModels();
  }

  loadVehicleModels() {
    this.isLoading = true;
    const sortParams = `${this.sortColumn},${this.sortDirection}`;
    
    this.vehicleModelsService.getVehicleModels(this.currentPage, this.pageSize, sortParams, this.searchQuery)
      .subscribe({
        next: (response) => {
          this.vehicleModels = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading vehicle models', error);
          this.isLoading = false;
        }
      });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 0;
    this.loadVehicleModels();
  }

  onSort(event: string) {
    if (this.sortColumn === event) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = event;
      this.sortDirection = 'asc';
    }
    this.loadVehicleModels();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadVehicleModels();
  }

  onSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadVehicleModels();
  }

  handleMoreAction(action: string) {
    if (action === 'refresh') {
      this.loadVehicleModels();
    } else if (action === 'export') {
      console.log('Exporting vehicle models to CSV...');
    }
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(VehicleModelDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: null,
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vehicleModelsService.createVehicleModel(result).subscribe({
          next: () => this.loadVehicleModels(),
          error: (err) => console.error('Failed to create', err)
        });
      }
    });
  }

  handleAction(event: { action: string, item: any }) {
    const model = event.item as VehicleModel;
    
    switch (event.action) {
      case 'view':
        this.dialog.open(VehicleModelDetailDialogComponent, {
          width: '600px',
          maxWidth: '95vw',
          disableClose: false,
          hasBackdrop: true,
          data: model,
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });
        break;
      case 'edit':
        const editRef = this.dialog.open(VehicleModelDialogComponent, {
          width: '900px',
          maxWidth: '95vw',
          disableClose: false,
          hasBackdrop: true,
          data: model,
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });

        editRef.afterClosed().subscribe(result => {
          if (result && model.id) {
            this.isLoading = true;
            this.vehicleModelsService.updateVehicleModel(model.id, result).subscribe({
              next: () => {
                this.toastService.showSuccess('Vehicle model updated successfully.', 'Success');
                this.loadVehicleModels();
              },
              error: (err) => {
                console.error('Failed to update', err);
                this.toastService.showError('Failed to update vehicle model.', 'Error');
                this.isLoading = false;
              }
            });
          }
        });
        break;
      case 'delete':
        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
          width: '400px',
          disableClose: true,
          data: {
            title: 'Delete Vehicle Model',
            message: `Are you sure you want to delete the vehicle model "${model.name}"? This action will deactivate it.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
          },
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });

        confirmRef.afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed && model.id) {
            this.isLoading = true;
            this.vehicleModelsService.deleteVehicleModel(model.id).subscribe({
              next: () => {
                this.toastService.showSuccess('Vehicle model deleted successfully.', 'Success');
                this.loadVehicleModels();
              },
              error: (err) => {
                console.error('Failed to delete', err);
                this.toastService.showError('Failed to delete vehicle model.', 'Error');
                this.isLoading = false;
              }
            });
          }
        });
        break;
    }
  }
}
