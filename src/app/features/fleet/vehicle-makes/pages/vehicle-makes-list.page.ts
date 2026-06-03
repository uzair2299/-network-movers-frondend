import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { VehicleMake } from '../models/vehicle-make.model';
import { VehicleMakesService } from '../services/vehicle-makes.service';

@Component({
  selector: 'app-vehicle-makes-list',
  templateUrl: './vehicle-makes-list.page.html',
  styleUrls: ['./vehicle-makes-list.page.css']
})
export class VehicleMakesListPage implements OnInit {
  vehicleMakes: VehicleMake[] = [];
  isLoading = false;
  error: string | null = null;
  
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  sort = 'createdAt,desc';
  searchQuery = '';
  
  moreActions = [
    { id: 'export', label: 'Export Vehicle Makers' },
    { id: 'import', label: 'Import Vehicle Makers' }
  ];

  makeActions = [
    { id: 'view', label: 'View Details' },
    { id: 'edit', label: 'Edit Vehicle Maker' }
  ];

  constructor(private vehicleMakesService: VehicleMakesService, private router: Router) {}

  ngOnInit(): void {
    this.loadVehicleMakes();
  }

  loadVehicleMakes(): void {
    this.isLoading = true;
    this.error = null;
    this.vehicleMakesService.getVehicleMakes(this.currentPage, this.pageSize, this.sort)
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
    this.searchQuery = query;
    this.currentPage = 0;
    this.loadVehicleMakes();
  }

  createNewVehicleMake(): void {
    console.log('Create new vehicle maker clicked');
  }

  handleMoreAction(actionId: string): void {
    console.log('More action clicked:', actionId);
  }

  handleMakeAction(actionId: string, vehicleMake: VehicleMake): void {
    console.log('Vehicle maker action clicked:', actionId, 'for:', vehicleMake.code);
  }
}
