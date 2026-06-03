import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { VehicleType } from '../models/vehicle-type.model';
import { VehicleTypesService } from '../services/vehicle-types.service';

@Component({
  selector: 'app-vehicle-types-list',
  templateUrl: './vehicle-types-list.page.html',
  styleUrls: ['./vehicle-types-list.page.css']
})
export class VehicleTypesListPage implements OnInit {
  vehicleTypes: VehicleType[] = [];
  isLoading = false;
  error: string | null = null;
  
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  sort = 'createdAt,desc';
  searchQuery = '';
  
  moreActions = [
    { id: 'export', label: 'Export Vehicle Types' },
    { id: 'import', label: 'Import Vehicle Types' }
  ];

  vehicleActions = [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Vehicle Type' }
  ];

  constructor(private vehicleTypesService: VehicleTypesService, private router: Router) {}

  ngOnInit(): void {
    this.loadVehicleTypes();
  }

  loadVehicleTypes(): void {
    this.isLoading = true;
    this.error = null;
    this.vehicleTypesService.getVehicleTypes(this.currentPage, this.pageSize, this.sort)
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
    this.searchQuery = query;
    this.currentPage = 0;
    this.loadVehicleTypes();
  }

  createNewVehicleType(): void {
    console.log('Create new vehicle type clicked');
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handleVehicleAction(actionId: string, vehicleType: VehicleType): void {
    console.log('Vehicle action clicked:', actionId, 'for vehicle type:', vehicleType.code);
  }
}
