import { AfterViewInit, Component, ElementRef, OnDestroy, effect, inject, input, viewChild } from '@angular/core';
import * as L from 'leaflet';

/** Terracotta/ivory pin matching the site's brand palette — avoids bundling Leaflet's default marker image assets. */
const MARKER_ICON = L.divIcon({
  className: 'app-map-marker',
  html: `<svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z" fill="#A85C43"/>
      <circle cx="16" cy="16" r="6" fill="#F4EFE5"/>
    </svg>`,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -38],
});

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  latitude = input.required<number>();
  longitude = input.required<number>();
  /** Place name shown in the marker popup and used as the iframe title. */
  label = input('Erotic Garden & Teahouse');
  /** Full postal address shown under the place name in the marker popup. */
  address = input.required<string>();

  private readonly mapContainer = viewChild.required<ElementRef<HTMLElement>>('mapContainer');
  private map?: L.Map;

  constructor() {
    effect(() => {
      // Re-center if the coordinates ever change after the map has been created.
      const lat = this.latitude();
      const lng = this.longitude();
      this.map?.setView([lat, lng]);
    });
  }

  ngAfterViewInit(): void {
    const map = L.map(this.mapContainer().nativeElement, {
      center: [this.latitude(), this.longitude()],
      zoom: 15,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.marker([this.latitude(), this.longitude()], { icon: MARKER_ICON })
      .addTo(map)
      .bindPopup(`<strong>${this.label()}</strong><br>${this.address()}`)
      .openPopup();

    this.map = map;
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
