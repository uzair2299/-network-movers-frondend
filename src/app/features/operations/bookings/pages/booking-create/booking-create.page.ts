import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BookingsService } from '../../services/bookings.service';
import { PropertyService } from '../../../../system/property-management/services/property.service';
import { MoveStateService } from '../../../../system/move-state-management/services/move-state.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { 
  PropertyCategory, PropertyType, PropertySize, FloorType, 
  BuildingAccessType, ParkingAccessType, AccessRestrictionType 
} from '../../../../system/property-management/models/property.model';
import { MoveStatusResponse } from '../../../../system/move-state-management/models/move-state.model';

declare var google: any;

@Component({
  selector: 'app-booking-create-page',
  templateUrl: './booking-create.page.html',
  styleUrls: ['./booking-create.page.css']
})
export class BookingCreatePageComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  isSubmitting = false;

  @ViewChild('mapElement') mapElement!: ElementRef;
  @ViewChild('pickupInputContainer', { read: ElementRef }) pickupInputContainer!: ElementRef;
  @ViewChild('destinationInputContainer', { read: ElementRef }) destinationInputContainer!: ElementRef;

  map: any;
  directionsService: any;
  directionsRenderer: any;
  
  pickupPlace: any = null;
  destinationPlace: any = null;
  
  distanceText: string = '';
  durationText: string = '';
  distanceKm: number = 0;
  durationMinutes: number = 0;

  // Master lists loaded from services
  allCategories: PropertyCategory[] = [];
  allTypes: PropertyType[] = [];
  allSizes: PropertySize[] = [];
  allStatuses: MoveStatusResponse[] = [];
  
  floorTypesList: FloorType[] = [];
  buildingAccessList: BuildingAccessType[] = [];
  parkingAccessList: ParkingAccessType[] = [];
  accessRestrictionsList: AccessRestrictionType[] = [];

  // Dropdown Options
  categoryOptions: any[] = [];
  typeOptions: any[] = [];
  sizeOptions: any[] = [];
  statusOptions: any[] = [];
  floorTypeOptions: any[] = [];
  buildingAccessOptions: any[] = [];
  parkingAccessOptions: any[] = [];
  accessRestrictionOptions: any[] = [];

  scheduleTypeOptions = [
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Instant', value: 'instant' }
  ];

  timeSlotOptions = [
    { label: 'Morning', value: 'morning' },
    { label: 'Afternoon', value: 'afternoon' },
    { label: 'Evening', value: 'evening' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private bookingsService: BookingsService,
    private propertyService: PropertyService,
    private moveStateService: MoveStateService,
    private toastService: ToastService,
    private ngZone: NgZone
  ) {
    this.form = this.fb.group({
      // Basic Info
      name: ['', Validators.required],
      description: [''],
      currentStatusId: ['', Validators.required],

      // Scheduling Info
      scheduleType: ['scheduled', Validators.required],
      scheduledDate: ['', Validators.required],
      timeSlot: ['morning', Validators.required],

      // Specifications
      propertyCategoryId: ['', Validators.required],
      propertyTypeId: ['', Validators.required],
      propertySizeId: ['', Validators.required],

      // Locations
      pickupAddress: ['', Validators.required],
      pickupFloorTypeId: [''],
      pickupBuildingAccessId: ['', Validators.required],
      pickupParkingAccessId: ['', Validators.required],

      destinationAddress: ['', Validators.required],
      destinationFloorTypeId: [''],
      destinationBuildingAccessId: ['', Validators.required],
      destinationParkingAccessId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadMetadata();
    this.setupHierarchicalSelects();
  }

  ngAfterViewInit() {
    this.initMap();
    this.initAutocomplete();
  }

  loadMetadata() {
    // 1. Fetch Property Categories, Types, and Sizes
    this.propertyService.getCategories().subscribe({
      next: (res) => {
        this.allCategories = res;
        this.categoryOptions = res.map(c => ({ label: c.name, value: c.id }));
      },
      error: () => this.toastService.showError('Failed to load property categories', 'Error')
    });

    this.propertyService.getTypes().subscribe({
      next: (res) => {
        this.allTypes = res;
      },
      error: () => this.toastService.showError('Failed to load property types', 'Error')
    });

    this.propertyService.getSizes().subscribe({
      next: (res) => {
        this.allSizes = res;
      },
      error: () => this.toastService.showError('Failed to load property sizes', 'Error')
    });

    // 2. Fetch Move Phases and then Statuses
    this.moveStateService.getPhases().subscribe({
      next: (phases) => {
        if (phases && phases.length > 0) {
          const statusFetches = phases.map(p => this.moveStateService.getStatusesByPhaseId(p.id));
          forkJoin(statusFetches).subscribe({
            next: (statusesArrays) => {
              const flatStatuses = statusesArrays.reduce((acc, curr) => [...acc, ...curr], []);
              this.allStatuses = flatStatuses;
              this.statusOptions = flatStatuses.map(s => ({ label: s.name, value: s.id }));
              
              // Select first status by default if available
              if (flatStatuses.length > 0) {
                this.form.patchValue({ currentStatusId: flatStatuses[0].id });
              }
            },
            error: () => console.error('Failed to load statuses')
          });
        }
      },
      error: () => this.toastService.showError('Failed to load move phases', 'Error')
    });

    // 3. Fetch Floor, Building & Parking accesses
    this.propertyService.getActiveFloorTypes().subscribe({
      next: (res) => {
        this.floorTypesList = res;
        this.floorTypeOptions = res.map(t => ({ label: t.name, value: t.id }));
      }
    });

    this.propertyService.getActiveBuildingAccessTypes().subscribe({
      next: (res) => {
        this.buildingAccessList = res;
        this.buildingAccessOptions = res.map(t => ({ label: t.name, value: t.id }));
      }
    });

    this.propertyService.getActiveParkingAccessTypes().subscribe({
      next: (res) => {
        this.parkingAccessList = res;
        this.parkingAccessOptions = res.map(t => ({ label: t.name, value: t.id }));
      }
    });

    // 4. Fetch Access Restrictions
    this.propertyService.getActiveAccessRestrictions().subscribe({
      next: (res) => {
        this.accessRestrictionsList = res;
        this.accessRestrictionOptions = res.map(t => ({ label: t.name, value: t.id }));
        
        // Dynamically add form controls
        this.accessRestrictionOptions.forEach(r => {
          this.form.addControl('pickup_restriction_' + r.value, new FormControl(false));
          this.form.addControl('destination_restriction_' + r.value, new FormControl(false));
        });
      }
    });
  }

  setupHierarchicalSelects() {
    // Category -> Type
    this.form.get('propertyCategoryId')?.valueChanges.subscribe(catId => {
      const filteredTypes = this.allTypes.filter(t => t.category?.id === catId);
      this.typeOptions = filteredTypes.map(t => ({ label: t.name, value: t.id }));
      this.form.patchValue({ propertyTypeId: '', propertySizeId: '' }, { emitEvent: false });
      this.sizeOptions = [];
    });

    // Type -> Size
    this.form.get('propertyTypeId')?.valueChanges.subscribe(typeId => {
      const filteredSizes = this.allSizes.filter(s => s.type?.id === typeId);
      this.sizeOptions = filteredSizes.map(s => ({ label: s.name, value: s.id }));
      this.form.patchValue({ propertySizeId: '' }, { emitEvent: false });
    });
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
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }
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

    // Wait until elements are loaded in DOM
    setTimeout(() => {
      const pickupInputElement = this.pickupInputContainer.nativeElement.querySelector('input');
      const destinationInputElement = this.destinationInputContainer.nativeElement.querySelector('input');

      if (!pickupInputElement || !destinationInputElement) {
        console.error('Could not find input elements for Autocomplete');
        return;
      }

      const pickupAutocomplete = new google.maps.places.Autocomplete(pickupInputElement);
      const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInputElement);

      pickupAutocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = pickupAutocomplete.getPlace();
          if (place.geometry) {
            this.pickupPlace = place;
            this.form.patchValue({ pickupAddress: place.formatted_address || place.name });
            this.calculateRoute();
          }
        });
      });

      destinationAutocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = destinationAutocomplete.getPlace();
          if (place.geometry) {
            this.destinationPlace = place;
            this.form.patchValue({ destinationAddress: place.formatted_address || place.name });
            this.calculateRoute();
          }
        });
      });
    }, 500);
  }

  calculateRoute() {
    if (!this.pickupPlace || !this.destinationPlace || !this.directionsService) {
      if (this.pickupPlace && this.map) {
        this.map.panTo(this.pickupPlace.geometry.location);
        this.map.setZoom(15);
      } else if (this.destinationPlace && this.map) {
        this.map.panTo(this.destinationPlace.geometry.location);
        this.map.setZoom(15);
      }
      return;
    }

    const request = {
      origin: this.pickupPlace.geometry.location,
      destination: this.destinationPlace.geometry.location,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.ngZone.run(() => {
          this.directionsRenderer.setDirections(result);
          const route = result.routes[0].legs[0];
          this.distanceText = route.distance.text;
          this.durationText = route.duration.text;
          this.distanceKm = parseFloat(route.distance.text.replace(/[^\d.]/g, '')) || 0;
          this.durationMinutes = Math.round(route.duration.value / 60) || 0;
        });
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.showError('Please check form fields and correct all errors.', 'Validation Error');
      return;
    }

    this.isSubmitting = true;

    // 1. Resolve selected lookup object structures
    const category = this.allCategories.find(c => c.id === this.form.value.propertyCategoryId);
    const type = this.allTypes.find(t => t.id === this.form.value.propertyTypeId);
    const size = this.allSizes.find(s => s.id === this.form.value.propertySizeId);

    const pickupFloor = this.floorTypesList.find(f => f.id === this.form.value.pickupFloorTypeId);
    const destFloor = this.floorTypesList.find(f => f.id === this.form.value.destinationFloorTypeId);

    const pickupBuild = this.buildingAccessList.find(b => b.id === this.form.value.pickupBuildingAccessId);
    const destBuild = this.buildingAccessList.find(b => b.id === this.form.value.destinationBuildingAccessId);

    const pickupPark = this.parkingAccessList.find(p => p.id === this.form.value.pickupParkingAccessId);
    const destPark = this.parkingAccessList.find(p => p.id === this.form.value.destinationParkingAccessId);

    // Filter dynamic checkbox restrictions
    const pickupRestrictionIds = this.accessRestrictionOptions
      .filter(r => this.form.get('pickup_restriction_' + r.value)?.value)
      .map(r => r.value);

    const destRestrictionIds = this.accessRestrictionOptions
      .filter(r => this.form.get('destination_restriction_' + r.value)?.value)
      .map(r => r.value);

    // Format Scheduled ISO Date
    const scheduledDateVal = this.form.value.scheduledDate;
    let formattedDate = '';
    if (scheduledDateVal) {
      formattedDate = new Date(scheduledDateVal).toISOString();
    }

    // Build the final POST payload
    const bookingPayload = {
      name: this.form.value.name,
      description: this.form.value.description,
      current_status_id: this.form.value.currentStatusId,
      route_details: {
        pickup_address: this.form.value.pickupAddress,
        pickup_latitude: this.pickupPlace?.geometry?.location?.lat() || 25.2048,
        pickup_longitude: this.pickupPlace?.geometry?.location?.lng() || 55.2708,
        destination_address: this.form.value.destinationAddress,
        destination_latitude: this.destinationPlace?.geometry?.location?.lat() || 25.2048,
        destination_longitude: this.destinationPlace?.geometry?.location?.lng() || 55.2708,
        distance_km: this.distanceKm,
        duration_minutes: this.durationMinutes
      },
      scheduling: {
        schedule_type: this.form.value.scheduleType,
        scheduled_date: formattedDate,
        time_slot: this.form.value.timeSlot
      },
      move_specifications: {
        property_category_id: category?.id || '',
        property_category_code: category?.code || '',
        property_type_id: type?.id || '',
        property_type_code: type?.code || '',
        property_size_id: size?.id || '',
        property_size_code: size?.code || ''
      },
      access_details: {
        pickup: {
          floor_type_id: pickupFloor?.id || null,
          floor_type_code: pickupFloor?.code || null,
          building_access_id: pickupBuild?.id || '',
          building_access_code: pickupBuild?.code || '',
          parking_access_id: pickupPark?.id || '',
          parking_access_code: pickupPark?.code || '',
          restriction_ids: pickupRestrictionIds
        },
        destination: {
          floor_type_id: destFloor?.id || null,
          floor_type_code: destFloor?.code || null,
          building_access_id: destBuild?.id || '',
          building_access_code: destBuild?.code || '',
          parking_access_id: destPark?.id || '',
          parking_access_code: destPark?.code || '',
          restriction_ids: destRestrictionIds
        }
      }
    };

    console.log('Sending Booking Payload:', bookingPayload);

    this.bookingsService.createBooking(bookingPayload).subscribe({
      next: () => {
        this.toastService.showSuccess('Booking Created Successfully!', 'Success');
        this.isSubmitting = false;
        this.router.navigate(['/operations/bookings']);
      },
      error: (err) => {
        console.error('Failed to create booking', err);
        this.toastService.showError('Failed to create booking. Please try again.', 'Error');
        this.isSubmitting = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/operations/bookings']);
  }
}
