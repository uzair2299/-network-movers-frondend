import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VehiclesService } from '../services/vehicles.service';
import { Vehicle } from '../models/vehicle.model';
import { TableColumn } from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { VehicleDialogComponent } from '../dialogs/vehicle-dialog/vehicle-dialog.component';
import { VehicleDetailDialogComponent } from '../dialogs/vehicle-detail-dialog/vehicle-detail-dialog.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-vehicles-list',
  templateUrl: './vehicles-list.page.html',
  styleUrls: ['./vehicles-list.page.css']
})
export class VehiclesListPage implements OnInit {
  vehicles: Vehicle[] = [];
  isLoading = true;
  searchQuery = '';
  
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;

  sortColumn = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  tableColumns: TableColumn[] = [
    { key: 'vehicleCode', label: 'Vehicle Code', type: 'code', sortable: true, bold: true },
    { key: 'registrationNo', label: 'Reg Number', type: 'text', sortable: true },
    { key: 'vehicleModel', label: 'Model', type: 'text', sortable: false, valueGetter: (item: Vehicle) => item.vehicleModel?.name },
    { key: 'ownershipType', label: 'Ownership', type: 'text', sortable: true },
    { key: 'status', label: 'Status', type: 'status', sortable: true },
    { key: 'active', label: 'Active', type: 'status', sortable: true },
    { 
      key: 'actions', 
      label: 'Actions', 
      type: 'actions', 
      sortable: false,
      actionsDropdown: true,
      dropdownItems: [
        { id: 'view', label: 'View Details' },
        { id: 'edit', label: 'Edit Vehicle' },
        { id: 'delete', label: 'Delete Vehicle' }
      ]
    }
  ];

  moreActions = [
    { label: 'Export to CSV', id: 'export' },
    { label: 'Refresh List', id: 'refresh' }
  ];

  constructor(
    private vehiclesService: VehiclesService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.isLoading = true;
    const sortParams = `${this.sortColumn},${this.sortDirection}`;
    
    this.vehiclesService.getVehicles(
      this.currentPage,
      this.pageSize,
      sortParams,
      this.searchQuery
    ).subscribe({
      next: (response) => {
        this.vehicles = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load vehicles', err);
        this.toastService.showError('Failed to load vehicles.', 'Error');
        this.isLoading = false;
      }
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 0;
    this.loadVehicles();
  }

  onSort(event: { column: string, direction: 'asc' | 'desc' }) {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.currentPage = 0;
    this.loadVehicles();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadVehicles();
  }

  onSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadVehicles();
  }

  handleMoreAction(event: any) {
    const actionId = event.id || event.action;
    switch (actionId) {
      case 'export':
        this.toastService.showInfo('Export functionality coming soon.', 'Info');
        break;
      case 'refresh':
        this.loadVehicles();
        break;
    }
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(VehicleDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true,
      hasBackdrop: true,
      data: null,
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.vehiclesService.createVehicle(result).subscribe({
          next: () => {
            this.toastService.showSuccess('Vehicle created successfully.', 'Success');
            this.loadVehicles();
          },
          error: (err) => {
            console.error('Failed to create', err);
            this.toastService.showError('Failed to create vehicle.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  handleAction(event: { action: string, item: any }) {
    const vehicle = event.item as Vehicle;
    
    switch (event.action) {
      case 'view':
        this.dialog.open(VehicleDetailDialogComponent, {
          width: '600px',
          maxWidth: '95vw',
          disableClose: false,
          hasBackdrop: true,
          data: vehicle,
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });
        break;
      case 'edit':
        const editRef = this.dialog.open(VehicleDialogComponent, {
          width: '900px',
          maxWidth: '95vw',
          disableClose: true,
          hasBackdrop: true,
          data: vehicle,
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });

        editRef.afterClosed().subscribe(result => {
          if (result && vehicle.id) {
            this.isLoading = true;
            this.vehiclesService.updateVehicle(vehicle.id, result).subscribe({
              next: () => {
                this.toastService.showSuccess('Vehicle updated successfully.', 'Success');
                this.loadVehicles();
              },
              error: (err) => {
                console.error('Failed to update', err);
                this.toastService.showError('Failed to update vehicle.', 'Error');
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
            title: 'Delete Vehicle',
            message: `Are you sure you want to delete the vehicle "${vehicle.vehicleCode}"? This action will deactivate it.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'danger'
          },
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });

        confirmRef.afterClosed().subscribe((confirmed: boolean) => {
          if (confirmed && vehicle.id) {
            this.isLoading = true;
            this.vehiclesService.deleteVehicle(vehicle.id).subscribe({
              next: () => {
                this.toastService.showSuccess('Vehicle deleted successfully.', 'Success');
                this.loadVehicles();
              },
              error: (err) => {
                console.error('Failed to delete', err);
                this.toastService.showError('Failed to delete vehicle.', 'Error');
                this.isLoading = false;
              }
            });
          }
        });
        break;
    }
  }
}
