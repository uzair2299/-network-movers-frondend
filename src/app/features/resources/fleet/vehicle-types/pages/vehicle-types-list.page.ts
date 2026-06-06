import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { VehicleType } from '../models/vehicle-type.model';
import { VehicleTypesService } from '../services/vehicle-types.service';
import { VehicleTypeDialogComponent } from '../dialogs/vehicle-type-dialog/vehicle-type-dialog.component';
import { VehicleTypeDetailDialogComponent } from '../dialogs/vehicle-type-detail-dialog/vehicle-type-detail-dialog.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TableColumn } from '../../../../../shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-vehicle-types-list',
  templateUrl: './vehicle-types-list.page.html',
  styleUrls: ['./vehicle-types-list.page.css']
})
export class VehicleTypesListPage implements OnInit, OnDestroy {
  vehicleTypes: VehicleType[] = [];
  isLoading = false;
  error: string | null = null;
  
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  sortColumn: string = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchQuery = '';
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  
  get sort(): string {
    return `${this.sortColumn},${this.sortDirection}`;
  }
  
  moreActions = [
    { id: 'export', label: 'Export Vehicle Types' },
    { id: 'import', label: 'Import Vehicle Types' }
  ];

  vehicleActions = [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Vehicle Type' },
    { id: 'delete', label: 'Delete Vehicle Type' }
  ];

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text', sortable: true, bold: true },
    { key: 'code', label: 'Code', type: 'text', sortable: true },
    { key: 'description', label: 'Description', type: 'text', sortable: true },
    { key: 'active', label: 'Status', type: 'status', sortable: true },
    { 
      key: 'actions', 
      label: '', 
      type: 'actions', 
      actionsDropdown: true,
      dropdownItems: this.vehicleActions
    }
  ];

  constructor(
    private vehicleTypesService: VehicleTypesService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery = query;
      this.currentPage = 0;
      this.loadVehicleTypes();
    });

    this.loadVehicleTypes();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadVehicleTypes(): void {
    this.isLoading = true;
    this.error = null;
    this.vehicleTypesService.getVehicleTypes(this.currentPage, this.pageSize, this.sort, this.searchQuery)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.vehicleTypes = response.content;
          this.totalElements = response.totalElements;
        },
        error: (err) => {
          console.error('Error fetching vehicle types', err);
          this.error = 'Failed to load vehicle types. Please try again later.';
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadVehicleTypes();
  }

  onSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadVehicleTypes();
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  createNewVehicleType(): void {
    const dialogRef = this.dialog.open(VehicleTypeDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { isEdit: false },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: VehicleType | null) => {
      if (result) {
        this.isLoading = true;
        this.vehicleTypesService.createVehicleType(result).subscribe({
          next: () => {
            this.toastService.showSuccess('Vehicle type created successfully.', 'Success');
            this.loadVehicleTypes();
          },
          error: (err) => {
            console.error('Error creating vehicle type', err);
            this.error = 'Failed to create vehicle type.';
            this.isLoading = false;
          }
        });
      }
    });
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handleVehicleAction(actionId: string, vehicleType: VehicleType): void {
    if (actionId === 'edit') {
      this.editVehicleType(vehicleType);
    } else if (actionId === 'view') {
      this.viewVehicleType(vehicleType);
    } else if (actionId === 'delete') {
      this.deleteVehicleType(vehicleType);
    } else {
      console.log('Vehicle action clicked:', actionId, 'for vehicle type:', vehicleType.code);
    }
  }

  handleTableAction(event: { action: string, item: VehicleType }): void {
    this.handleVehicleAction(event.action, event.item);
  }

  deleteVehicleType(vehicleType: VehicleType): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Delete Vehicle Type',
        message: `Are you sure you want to delete the vehicle type "${vehicleType.name}"? This action will deactivate it.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.isLoading = true;
        this.vehicleTypesService.deleteVehicleType(vehicleType.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Vehicle type deleted successfully.', 'Success');
            this.loadVehicleTypes();
          },
          error: (err) => {
            console.error('Error deleting vehicle type', err);
            this.toastService.showError('Failed to delete vehicle type.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  viewVehicleType(vehicleType: VehicleType): void {
    this.isLoading = true;
    this.vehicleTypesService.getVehicleTypeById(vehicleType.id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (fullVehicleType) => {
        this.dialog.open(VehicleTypeDetailDialogComponent, {
          width: '600px',
          maxWidth: '95vw',
          disableClose: false,
          hasBackdrop: true,
          data: { vehicleType: fullVehicleType },
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });
      },
      error: (err) => {
        console.error('Error fetching vehicle type details', err);
        this.toastService.showError('Failed to load vehicle type details.', 'Error');
      }
    });
  }

  editVehicleType(vehicleType: VehicleType): void {
    const dialogRef = this.dialog.open(VehicleTypeDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { vehicleType, isEdit: true },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: VehicleType | null) => {
      if (result) {
        this.isLoading = true;
        this.vehicleTypesService.updateVehicleType(vehicleType.id, result).subscribe({
          next: () => {
            this.toastService.showSuccess('Vehicle type updated successfully.', 'Success');
            this.loadVehicleTypes();
          },
          error: (err) => {
            console.error('Error updating vehicle type', err);
            this.error = 'Failed to update vehicle type.';
            this.isLoading = false;
          }
        });
      }
    });
  }

  toggleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 0;
    this.loadVehicleTypes();
  }
}
