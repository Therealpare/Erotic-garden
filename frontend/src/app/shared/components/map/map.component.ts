import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { buildGoogleMapsEmbedUrl } from '../../utils/maps.util';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  /** Full postal address (or place name) to center the map on. */
  address = input.required<string>();
  title = input('Map showing the garden location');

  private readonly sanitizer = inject(DomSanitizer);

  readonly hasApiKey = computed(() => environment.googleMapsApiKey.trim().length > 0);

  readonly embedUrl = computed<SafeResourceUrl>(() => {
    const url = buildGoogleMapsEmbedUrl(this.address(), environment.googleMapsApiKey);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });
}
