import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehicleModelsService } from '../../../vehicle-models/services/vehicle-models.service';
import { Vehicle, OwnershipType, VehicleStatus } from '../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-dialog',
  templateUrl: './vehicle-dialog.component.html',
  styleUrls: ['./vehicle-dialog.component.css']
})
export class VehicleDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  modelsOptions: { label: string, value: any }[] = [];
  ownershipOptions = [
    { label: 'Company', value: OwnershipType.COMPANY },
    { label: 'Contractor', value: OwnershipType.CONTRACTOR },
    { label: 'Rental', value: OwnershipType.RENTAL }
  ];
  statusOptions = [
    { label: 'Available', value: VehicleStatus.AVAILABLE },
    { label: 'Assigned', value: VehicleStatus.ASSIGNED },
    { label: 'In Transit', value: VehicleStatus.IN_TRANSIT },
    { label: 'Maintenance', value: VehicleStatus.MAINTENANCE },
    { label: 'Out of Service', value: VehicleStatus.OUT_OF_SERVICE },
    { label: 'Retired', value: VehicleStatus.RETIRED }
  ];
  isLoadingData = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VehicleDialogComponent>,
    private vehicleModelsService: VehicleModelsService,
    @Inject(MAT_DIALOG_DATA) public data: Vehicle | null
  ) {
    this.isEditMode = !!data;
    this.form = this.fb.group({
      vehicleCode: [data?.vehicleCode || '', Validators.required],
      registrationNo: [data?.registrationNo || '', Validators.required],
      vehicleModelId: [data?.vehicleModel?.id || '', Validators.required],
      manufactureYear: [data?.manufactureYear || new Date().getFullYear(), [Validators.min(1900)]],
      ownershipType: [data?.ownershipType || OwnershipType.COMPANY, Validators.required],
      status: [data?.status || VehicleStatus.AVAILABLE, Validators.required],
      currentOdometerKm: [data?.currentOdometerKm || 0, [Validators.min(0)]],
      insuranceExpiryDate: [data?.insuranceExpiryDate || ''],
      fitnessExpiryDate: [data?.fitnessExpiryDate || ''],
      acquisitionDate: [data?.acquisitionDate || ''],
      active: [data ? data.active : true],
      remarks: [data?.remarks || '']
    });
  }

  ngOnInit() {
    this.loadDropdownData();
  }

  loadDropdownData() {
    this.vehicleModelsService.getVehicleModels(0, 1000).subscribe({
      next: (res: any) => {
        this.modelsOptions = res.content.map((m: any) => ({ label: `${m.name} (${m.code})`, value: m.id }));
        this.isLoadingData = false;
      },
      error: () => this.isLoadingData = false
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
