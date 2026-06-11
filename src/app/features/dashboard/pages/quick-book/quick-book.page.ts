import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import { PropertyService } from '../../../system/property-management/services/property.service';
import { SharedModule } from '../../../../shared/shared.module';
import { forkJoin } from 'rxjs';
import { BookingsService } from '../../../operations/bookings/services/bookings.service';
import { MoveStateService } from '../../../system/move-state-management/services/move-state.service';

declare var google: any;

@Component({
  selector: 'app-quick-book-page',
  templateUrl: './quick-book.page.html',
  styleUrls: ['./quick-book.page.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule]
})
export class QuickBookPageComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  isSubmitting = false;

  @ViewChild('mapElement') mapElement!: ElementRef;
  @ViewChild('pickupInput') pickupInput!: ElementRef;
  @ViewChild('dropoffInput') dropoffInput!: ElementRef;

  map: any;
  directionsService: any;
  directionsRenderer: any;
  
  pickupPlace: any = null;
  dropoffPlace: any = null;
  
  distanceText: string = '';
  durationText: string = '';
  
  buildingAccessTypes: any[] = [];
  parkingAccessTypes: any[] = [];
  floorTypes: any[] = [];
  accessRestrictionTypes: any[] = [];

  // Metadata arrays to map codes
  rawBuildingAccessTypes: any[] = [];
  rawParkingAccessTypes: any[] = [];
  rawFloorTypes: any[] = [];
  rawAccessRestrictionTypes: any[] = [];
  allSizes: any[] = [];
  allStatuses: any[] = [];
  
  sizeOptions = [
    { label: 'Studio', value: 'Studio' },
    { label: '1 Bedroom', value: '1 BR' },
    { label: '2 Bedroom', value: '2 BR' },
    { label: '3 Bedroom', value: '3 BR' },
    { label: 'Villa / Townhouse', value: 'Villa' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private ngZone: NgZone,
    private propertyService: PropertyService,
    private bookingsService: BookingsService,
    private moveStateService: MoveStateService
  ) {
    this.form = this.fb.group({
      // Basic info
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientPhone: ['', Validators.required],
      
      // Location
      pickup: ['', Validators.required],
      pickupUnit: [''],
      dropoff: ['', Validators.required],
      dropoffUnit: [''],
      
      // Move Details
      moveDate: ['', Validators.required],
      moveTime: ['', Validators.required],
      size: ['', Validators.required],
      
      // Pickup Specs
      pickupFloorTypeId: [''],
      pickupBuildingAccessTypeId: [''],
      pickupParkingAccessTypeId: [''],
      pickupAccessRestrictionTypeIds: [[]],
      
      // Dropoff Specs
      dropoffFloorTypeId: [''],
      dropoffBuildingAccessTypeId: [''],
      dropoffParkingAccessTypeId: [''],
      dropoffAccessRestrictionTypeIds: [[]],
      
      // Extra
      notes: ['']
    });
  }

  ngOnInit() {
    this.propertyService.getActiveBuildingAccessTypes().subscribe({
      next: (types) => {
        this.rawBuildingAccessTypes = types;
        this.buildingAccessTypes = types.map((t: any) => ({ label: t.name, value: t.id }));
      },
      error: () => console.error('Failed to load building access types')
    });

    this.propertyService.getActiveParkingAccessTypes().subscribe({
      next: (types) => {
        this.rawParkingAccessTypes = types;
        this.parkingAccessTypes = types.map((t: any) => ({ label: t.name, value: t.id }));
      },
      error: () => console.error('Failed to load parking access types')
    });

    this.propertyService.getActiveFloorTypes().subscribe({
      next: (types) => {
        this.rawFloorTypes = types;
        this.floorTypes = types.map((t: any) => ({ label: t.name, value: t.id }));
      },
      error: () => console.error('Failed to load floor types')
    });

    this.propertyService.getActiveAccessRestrictions().subscribe({
      next: (types) => {
        this.rawAccessRestrictionTypes = types;
        this.accessRestrictionTypes = types.map((t: any) => ({ label: t.name, value: t.id }));
        // Dynamically add boolean FormControls for the shared app-form-checkbox component
        this.accessRestrictionTypes.forEach(t => {
          this.form.addControl('pickup_restriction_' + t.value, new FormControl(false));
          this.form.addControl('dropoff_restriction_' + t.value, new FormControl(false));
        });
      },
      error: () => console.error('Failed to load access restriction types')
    });

    this.propertyService.getSizes().subscribe({
      next: (sizes) => {
        this.allSizes = sizes;
      }
    });

    this.moveStateService.getPhases().subscribe({
      next: (phases) => {
        if (phases && phases.length > 0) {
          const statusFetches = phases.map(p => this.moveStateService.getStatusesByPhaseId(p.id));
          forkJoin(statusFetches).subscribe({
            next: (statusesArrays) => {
              this.allStatuses = statusesArrays.reduce((acc, curr) => [...acc, ...curr], []);
            }
          });
        }
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
    this.initAutocomplete();
  }



  initMap() {
    if (typeof google === 'undefined') {
      console.error('Google Maps API not loaded');
      return;
    }

    const defaultLocation = { lat: 25.2048, lng: 55.2708 }; // Dubai default

    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: defaultLocation,
      zoom: 11,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
        { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
        { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
        { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
        { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
        { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
      ],
      disableDefaultUI: true,
      zoomControl: true
    });

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: this.map,
      polylineOptions: {
        strokeColor: '#f5a623',
        strokeWeight: 4
      }
    });
  }

  initAutocomplete() {
    if (typeof google === 'undefined') return;

    const pickupAutocomplete = new google.maps.places.Autocomplete(this.pickupInput.nativeElement);
    const dropoffAutocomplete = new google.maps.places.Autocomplete(this.dropoffInput.nativeElement);

    pickupAutocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = pickupAutocomplete.getPlace();
        if (place.geometry) {
          this.pickupPlace = place;
          this.form.patchValue({ pickup: place.formatted_address || place.name });
          this.calculateRoute();
        }
      });
    });

    dropoffAutocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = dropoffAutocomplete.getPlace();
        if (place.geometry) {
          this.dropoffPlace = place;
          this.form.patchValue({ dropoff: place.formatted_address || place.name });
          this.calculateRoute();
        }
      });
    });
  }

  durationMinutes: number = 0;

  calculateRoute() {
    if (!this.pickupPlace || !this.dropoffPlace || !this.directionsService) {
      if (this.pickupPlace) {
        this.map.panTo(this.pickupPlace.geometry.location);
        this.map.setZoom(15);
      } else if (this.dropoffPlace) {
        this.map.panTo(this.dropoffPlace.geometry.location);
        this.map.setZoom(15);
      }
      return;
    }

    const request = {
      origin: this.pickupPlace.geometry.location,
      destination: this.dropoffPlace.geometry.location,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.ngZone.run(() => {
          this.directionsRenderer.setDirections(result);
          const route = result.routes[0].legs[0];
          this.distanceText = route.distance.text;
          this.durationText = route.duration.text;
          this.durationMinutes = Math.round(route.duration.value / 60) || 0;
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.showError('Please fill out all required fields properly.', 'Error');
      return;
    }
    
    this.isSubmitting = true;

    // Resolve property specifications from size selection
    const selectedSizeValue = this.form.value.size; // e.g. "Studio", "1 BR", "2 BR", "3 BR", "Villa"
    const sizeMap: { [key: string]: string } = {
      'Studio': 'STUDIO',
      '1 BR': '1_BR',
      '2 BR': '2_BR',
      '3 BR': '3_BR',
      'Villa': 'VILLA'
    };
    const targetCode = sizeMap[selectedSizeValue] || selectedSizeValue.toUpperCase();
    
    const matchedSize = this.allSizes.find(s => 
      s.code.toUpperCase() === targetCode || 
      s.code.toUpperCase().replace('_', '') === targetCode.replace('_', '') ||
      s.name.toUpperCase().includes(selectedSizeValue.toUpperCase())
    ) || this.allSizes[0];

    // Access elements codes lookup
    const pickupBuilding = this.rawBuildingAccessTypes.find(b => b.id === this.form.value.pickupBuildingAccessTypeId);
    const dropoffBuilding = this.rawBuildingAccessTypes.find(b => b.id === this.form.value.dropoffBuildingAccessTypeId);

    const pickupParking = this.rawParkingAccessTypes.find(p => p.id === this.form.value.pickupParkingAccessTypeId);
    const dropoffParking = this.rawParkingAccessTypes.find(p => p.id === this.form.value.dropoffParkingAccessTypeId);

    const pickupFloor = this.rawFloorTypes.find(f => f.id === this.form.value.pickupFloorTypeId);
    const dropoffFloor = this.rawFloorTypes.find(f => f.id === this.form.value.dropoffFloorTypeId);

    const pickupRestrictionIds = this.accessRestrictionTypes
      .filter(t => this.form.get('pickup_restriction_' + t.value)?.value)
      .map(t => t.value);
    
    const dropoffRestrictionIds = this.accessRestrictionTypes
      .filter(t => this.form.get('dropoff_restriction_' + t.value)?.value)
      .map(t => t.value);

    // Format Scheduled Date Time
    const moveDateVal = this.form.value.moveDate; // e.g., "2026-06-15"
    const moveTimeVal = this.form.value.moveTime; // e.g., "09:00"
    let isoScheduledDate = '';
    if (moveDateVal && moveTimeVal) {
      isoScheduledDate = new Date(`${moveDateVal}T${moveTimeVal}:00`).toISOString();
    }

    // Determine Time Slot based on hour
    const hour = parseInt(moveTimeVal.split(':')[0], 10) || 9;
    let timeSlot = 'morning';
    if (hour >= 12 && hour < 17) {
      timeSlot = 'afternoon';
    } else if (hour >= 17) {
      timeSlot = 'evening';
    }

    // Default Status Lookup
    const defaultStatus = this.allStatuses.find(s => s.code === 'PENDING' || s.code === 'REQUESTED' || s.sequenceNo === 1) || this.allStatuses[0];

    // Compute route details
    let distKm = 0;
    if (this.distanceText) {
      distKm = parseFloat(this.distanceText.replace(/[^\d.]/g, '')) || 0;
    }

    // Prepare JSON payload
    const bookingPayload = {
      name: 'Quick Book: ' + this.form.value.clientName,
      description: `Quick book entry.\nClient Name: ${this.form.value.clientName}\nEmail: ${this.form.value.clientEmail}\nPhone: ${this.form.value.clientPhone}\nNotes: ${this.form.value.notes || 'None'}`,
      current_status_id: defaultStatus?.id || '764b8cbb-e79e-4e6c-a81d-ef1f9c894101',
      route_details: {
        pickup_address: this.form.value.pickup,
        pickup_latitude: this.pickupPlace?.geometry?.location?.lat() || 25.2048,
        pickup_longitude: this.pickupPlace?.geometry?.location?.lng() || 55.2708,
        destination_address: this.form.value.dropoff,
        destination_latitude: this.dropoffPlace?.geometry?.location?.lat() || 25.2048,
        destination_longitude: this.dropoffPlace?.geometry?.location?.lng() || 55.2708,
        distance_km: distKm,
        duration_minutes: this.durationMinutes
      },
      scheduling: {
        schedule_type: 'scheduled',
        scheduled_date: isoScheduledDate,
        time_slot: timeSlot
      },
      move_specifications: {
        property_category_id: matchedSize?.type?.category?.id || '8c459f03-6f29-450f-a2e6-c1a7d6e6a102',
        property_category_code: matchedSize?.type?.category?.code || 'COMMERCIAL',
        property_type_id: matchedSize?.type?.id || 'a1f9e20a-6e54-41bb-a5cc-ef1fb08e19c3',
        property_type_code: matchedSize?.type?.code || 'OFFICE',
        property_size_id: matchedSize?.id || '35a8df2d-b08e-49b4-934c-6d656cf8a2e5',
        property_size_code: matchedSize?.code || 'LARGE'
      },
      access_details: {
        pickup: {
          floor_type_id: pickupFloor?.id || null,
          floor_type_code: pickupFloor?.code || null,
          building_access_id: pickupBuilding?.id || '',
          building_access_code: pickupBuilding?.code || '',
          parking_access_id: pickupParking?.id || '',
          parking_access_code: pickupParking?.code || '',
          restriction_ids: pickupRestrictionIds
        },
        destination: {
          floor_type_id: dropoffFloor?.id || null,
          floor_type_code: dropoffFloor?.code || null,
          building_access_id: dropoffBuilding?.id || '',
          building_access_code: dropoffBuilding?.code || '',
          parking_access_id: dropoffParking?.id || '',
          parking_access_code: dropoffParking?.code || '',
          restriction_ids: dropoffRestrictionIds
        }
      }
    };

    console.log('Sending Quick Book Payload:', bookingPayload);

    this.bookingsService.createBooking(bookingPayload).subscribe({
      next: () => {
        this.toastService.showSuccess('Move Booked Successfully!', 'Quick Book');
        this.isSubmitting = false;
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Failed to book move', err);
        this.toastService.showError('Failed to create booking. Please try again.', 'Error');
        this.isSubmitting = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  fillTestData() {
    this.form.patchValue({
      clientName: 'Test Client Ltd',
      clientEmail: 'test.client@example.com',
      clientPhone: '+971 50 123 4567',
      pickup: 'Burj Khalifa, Boulevard Boulevard, Dubai, UAE',
      pickupUnit: 'Penthouse 101',
      dropoff: 'Dubai Marina, Dubai, UAE',
      dropoffUnit: 'Villa 22',
      moveDate: '2026-06-25',
      moveTime: '10:00',
      size: '2 BR',
      pickupFloorTypeId: this.floorTypes[0]?.value || '',
      pickupBuildingAccessTypeId: this.buildingAccessTypes[0]?.value || '',
      pickupParkingAccessTypeId: this.parkingAccessTypes[0]?.value || '',
      dropoffFloorTypeId: this.floorTypes[1]?.value || '',
      dropoffBuildingAccessTypeId: this.buildingAccessTypes[1]?.value || '',
      dropoffParkingAccessTypeId: this.parkingAccessTypes[1]?.value || '',
      notes: 'This is a mock booking populated via test-automation trigger.'
    });

    // Toggle restriction checkboxes
    if (this.accessRestrictionTypes.length > 0) {
      const firstRestriction = this.accessRestrictionTypes[0].value;
      this.form.get('pickup_restriction_' + firstRestriction)?.setValue(true);
    }
    if (this.accessRestrictionTypes.length > 1) {
      const secondRestriction = this.accessRestrictionTypes[1].value;
      this.form.get('dropoff_restriction_' + secondRestriction)?.setValue(true);
    }

    // Mock Google Places details for route calculation
    this.pickupPlace = {
      formatted_address: 'Burj Khalifa, Dubai',
      name: 'Burj Khalifa',
      geometry: {
        location: new google.maps.LatLng(25.1972, 55.2744)
      }
    };

    this.dropoffPlace = {
      formatted_address: 'Dubai Marina, Dubai',
      name: 'Dubai Marina',
      geometry: {
        location: new google.maps.LatLng(25.0819, 55.1368)
      }
    };

    // Trigger route calculation
    this.calculateRoute();
  }
}
