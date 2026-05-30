import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../../../shared/services/toast.service';

declare var google: any;

@Component({
  selector: 'app-quick-move-book-dialog',
  templateUrl: './quick-move-book-dialog.component.html',
  styleUrls: ['./quick-move-book-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class QuickMoveBookDialogComponent implements OnInit, AfterViewInit {
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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<QuickMoveBookDialogComponent>,
    private toastService: ToastService,
    private ngZone: NgZone
  ) {
    this.form = this.fb.group({
      clientName: ['', Validators.required],
      pickup: ['', Validators.required],
      dropoff: ['', Validators.required],
      moveDate: ['', Validators.required],
      size: ['', Validators.required]
    });
  }

  ngOnInit() {}

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
    if (this.form.invalid) return;
    
    this.isSubmitting = true;
    
    // Mock API call delay
    setTimeout(() => {
      this.isSubmitting = false;
      this.toastService.showSuccess('Move Booked Successfully!', 'Quick Book');
      this.dialogRef.close(this.form.value);
    }, 1500);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
