import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import { PropertyService } from '../../../system/property-management/services/property.service';
import { SharedModule } from '../../../../shared/shared.module';

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
    private propertyService: PropertyService
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
      next: (types) => this.buildingAccessTypes = types.map((t: any) => ({ label: t.name, value: t.id })),
      error: () => console.error('Failed to load building access types')
    });

    this.propertyService.getActiveParkingAccessTypes().subscribe({
      next: (types) => this.parkingAccessTypes = types.map((t: any) => ({ label: t.name, value: t.id })),
      error: () => console.error('Failed to load parking access types')
    });

    this.propertyService.getActiveFloorTypes().subscribe({
      next: (types) => this.floorTypes = types.map((t: any) => ({ label: t.name, value: t.id })),
      error: () => console.error('Failed to load floor types')
    });

    this.propertyService.getActiveAccessRestrictions().subscribe({
      next: (types) => {
        this.accessRestrictionTypes = types.map((t: any) => ({ label: t.name, value: t.id }));
        // Dynamically add boolean FormControls for the shared app-form-checkbox component
        this.accessRestrictionTypes.forEach(t => {
          this.form.addControl('pickup_restriction_' + t.value, new FormControl(false));
          this.form.addControl('dropoff_restriction_' + t.value, new FormControl(false));
        });
      },
      error: () => console.error('Failed to load access restriction types')
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

    // Map the dynamic boolean FormControls back into an array of IDs for the backend
    const pickupRestrictionIds = this.accessRestrictionTypes
      .filter(t => this.form.get('pickup_restriction_' + t.value)?.value)
      .map(t => t.value);
    
    const dropoffRestrictionIds = this.accessRestrictionTypes
      .filter(t => this.form.get('dropoff_restriction_' + t.value)?.value)
      .map(t => t.value);

    // This is the final payload containing the properly formatted arrays
    const finalPayload = {
      ...this.form.value,
      pickupAccessRestrictionTypeIds: pickupRestrictionIds,
      dropoffAccessRestrictionTypeIds: dropoffRestrictionIds
    };
    console.log('Booking Payload:', finalPayload);
    
    setTimeout(() => {
      this.isSubmitting = false;
      this.toastService.showSuccess('Move Booked Successfully!', 'Quick Book');
      this.router.navigate(['../'], { relativeTo: this.route });
    }, 1500);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
