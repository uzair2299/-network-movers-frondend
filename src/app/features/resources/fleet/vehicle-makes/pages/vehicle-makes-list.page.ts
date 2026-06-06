import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { VehicleMake } from '../models/vehicle-make.model';
import { VehicleMakesService } from '../services/vehicle-makes.service';
import { VehicleMakeDialogComponent } from '../dialogs/vehicle-make-dialog/vehicle-make-dialog.component';
import { VehicleMakeDetailDialogComponent } from '../dialogs/vehicle-make-detail-dialog/vehicle-make-detail-dialog.component';
import { ToastService } from '../../../../../shared/services/toast.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TableColumn } from '../../../../../shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-vehicle-makes-list',
  templateUrl: './vehicle-makes-list.page.html',
  styleUrls: ['./vehicle-makes-list.page.css']
})
export class VehicleMakesListPage implements OnInit, OnDestroy {
  vehicleMakes: VehicleMake[] = [];
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
    { id: 'export', label: 'Export Vehicle Makers' },
    { id: 'import', label: 'Import Vehicle Makers' }
  ];

  makeActions = [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Vehicle Maker' },
    { id: 'delete', label: 'Delete Vehicle Maker' }
  ];

  tableColumns: TableColumn[] = [
    { key: 'name', label: 'Name', type: 'text', sortable: true, bold: true },
    { key: 'code', label: 'Code', type: 'text', sortable: true },
    { key: 'country', label: 'Country', type: 'text', sortable: true },
    { key: 'active', label: 'Status', type: 'status', sortable: true },
    { 
      key: 'actions', 
      label: '', 
      type: 'actions', 
      actionsDropdown: true,
      dropdownItems: this.makeActions
    }
  ];

  constructor(
    private vehicleMakesService: VehicleMakesService,
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
      this.loadVehicleMakes();
    });

    this.loadVehicleMakes();
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadVehicleMakes(): void {
    this.isLoading = true;
    this.error = null;
    this.vehicleMakesService.getVehicleMakes(this.currentPage, this.pageSize, this.sort, this.searchQuery)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.vehicleMakes = response.content;
          this.totalElements = response.totalElements;
        },
        error: (err) => {
          console.error('Error fetching vehicle makes', err);
          this.error = 'Failed to load vehicle makers. Please try again later.';
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadVehicleMakes();
  }

  onSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadVehicleMakes();
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  createNewVehicleMake(): void {
    const dialogRef = this.dialog.open(VehicleMakeDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { isEdit: false },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: VehicleMake | null) => {
      if (result) {
        this.isLoading = true;
        this.vehicleMakesService.createVehicleMake(result).subscribe({
          next: () => {
            this.toastService.showSuccess('Vehicle maker created successfully.', 'Success');
            this.loadVehicleMakes();
          },
          error: (err) => {
            console.error('Error creating vehicle make', err);
            this.error = 'Failed to create vehicle maker.';
            this.isLoading = false;
          }
        });
      }
    });
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handleMakeAction(actionId: string, vehicleMake: VehicleMake): void {
    if (actionId === 'edit') {
      this.editVehicleMake(vehicleMake);
    } else if (actionId === 'view') {
      this.viewVehicleMake(vehicleMake);
    } else if (actionId === 'delete') {
      this.deleteVehicleMake(vehicleMake);
    } else {
      console.log('Vehicle maker action clicked:', actionId, 'for vehicle make:', vehicleMake.code);
    }
  }

  handleTableAction(event: { action: string, item: VehicleMake }): void {
    this.handleMakeAction(event.action, event.item);
  }

  deleteVehicleMake(vehicleMake: VehicleMake): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        title: 'Delete Vehicle Maker',
        message: `Are you sure you want to delete the vehicle maker "${vehicleMake.name}"? This action will deactivate it.`,
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
        this.vehicleMakesService.deleteVehicleMake(vehicleMake.id).subscribe({
          next: () => {
            this.toastService.showSuccess('Vehicle maker deleted successfully.', 'Success');
            this.loadVehicleMakes();
          },
          error: (err) => {
            console.error('Error deleting vehicle make', err);
            this.toastService.showError('Failed to delete vehicle maker.', 'Error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  viewVehicleMake(vehicleMake: VehicleMake): void {
    this.isLoading = true;
    this.vehicleMakesService.getVehicleMakeById(vehicleMake.id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (fullVehicleMake) => {
        this.dialog.open(VehicleMakeDetailDialogComponent, {
          width: '600px',
          maxWidth: '95vw',
          disableClose: false,
          hasBackdrop: true,
          data: { vehicleMake: fullVehicleMake },
          panelClass: 'premium-dark-dialog',
          backdropClass: 'premium-backdrop'
        });
      },
      error: (err) => {
        console.error('Error fetching vehicle make details', err);
        this.toastService.showError('Failed to load vehicle maker details.', 'Error');
      }
    });
  }

  editVehicleMake(vehicleMake: VehicleMake): void {
    const dialogRef = this.dialog.open(VehicleMakeDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      disableClose: false,
      hasBackdrop: true,
      data: { vehicleMake, isEdit: true },
      panelClass: 'premium-dark-dialog',
      backdropClass: 'premium-backdrop'
    });

    dialogRef.afterClosed().subscribe((result: VehicleMake | null) => {
      if (result) {
        this.isLoading = true;
        this.vehicleMakesService.updateVehicleMake(vehicleMake.id, result).subscribe({
          next: () => {
            this.toastService.showSuccess('Vehicle maker updated successfully.', 'Success');
            this.loadVehicleMakes();
          },
          error: (err) => {
            console.error('Error updating vehicle make', err);
            this.error = 'Failed to update vehicle maker.';
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
    this.loadVehicleMakes();
  }
}
