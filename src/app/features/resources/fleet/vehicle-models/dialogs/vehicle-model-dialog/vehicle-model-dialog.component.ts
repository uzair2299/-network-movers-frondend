import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehicleMake } from '../../../vehicle-makes/models/vehicle-make.model';
import { VehicleType } from '../../../vehicle-types/models/vehicle-type.model';
import { VehicleMakesService } from '../../../vehicle-makes/services/vehicle-makes.service';
import { VehicleTypesService } from '../../../vehicle-types/services/vehicle-types.service';
import { VehicleModel } from '../../models/vehicle-model.model';

@Component({
  selector: 'app-vehicle-model-dialog',
  templateUrl: './vehicle-model-dialog.component.html',
  styleUrls: ['./vehicle-model-dialog.component.css']
})
export class VehicleModelDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  makesOptions: { label: string, value: any }[] = [];
  typesOptions: { label: string, value: any }[] = [];
  isLoadingData = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VehicleModelDialogComponent>,
    private makesService: VehicleMakesService,
    private typesService: VehicleTypesService,
    @Inject(MAT_DIALOG_DATA) public data: VehicleModel | null
  ) {
    this.isEditMode = !!data;
    this.form = this.fb.group({
      makeId: [data?.make?.id || '', Validators.required],
      vehicleTypeId: [data?.vehicleType?.id || '', Validators.required],
      code: [data?.code || '', Validators.required],
      name: [data?.name || '', Validators.required],
      capacityKg: [data?.capacityKg || 0, [Validators.required, Validators.min(0)]],
      capacityM3: [data?.capacityM3 || 0, [Validators.required, Validators.min(0)]],
      lengthM: [data?.lengthM || 0, [Validators.required, Validators.min(0)]],
      widthM: [data?.widthM || 0, [Validators.required, Validators.min(0)]],
      heightM: [data?.heightM || 0, [Validators.required, Validators.min(0)]],
      active: [data ? data.active : true]
    });
  }

  ngOnInit() {
    this.loadDropdownData();
  }

  loadDropdownData() {
    this.makesService.getVehicleMakes(0, 1000).subscribe({
      next: (makesRes) => {
        this.makesOptions = makesRes.content.map(m => ({ label: `${m.name} (${m.code})`, value: m.id }));
        this.typesService.getVehicleTypes(0, 1000).subscribe({
          next: (typesRes) => {
            this.typesOptions = typesRes.content.map(t => ({ label: t.name, value: t.id }));
            this.isLoadingData = false;
          },
          error: () => this.isLoadingData = false
        });
      },
      error: () => this.isLoadingData = false
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
