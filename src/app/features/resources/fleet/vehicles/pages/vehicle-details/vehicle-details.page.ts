import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiclesService } from '../../services/vehicles.service';
import { Vehicle } from '../../models/vehicle.model';
import { ToastService } from '../../../../../../shared/services/toast.service';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.page.html',
  styleUrls: ['./vehicle-details.page.css']
})
export class VehicleDetailsPage implements OnInit {
  vehicle: Vehicle | null = null;
  isLoading = true;
  vehicleId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehiclesService: VehiclesService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.vehicleId = params.get('id');
      if (this.vehicleId) {
        this.loadVehicleDetails(this.vehicleId);
      } else {
        this.toastService.showError('No Vehicle ID provided');
        this.goBack();
      }
    });
  }

  loadVehicleDetails(id: string): void {
    this.isLoading = true;
    this.vehiclesService.getVehicleById(id).subscribe({
      next: (data) => {
        this.vehicle = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load vehicle details', err);
        this.toastService.showError('Failed to load vehicle details');
        this.isLoading = false;
        this.goBack();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/resources/fleet/vehicles']);
  }
}
