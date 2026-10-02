import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SiteSettings } from '../models/site-settings.model';

/**
 * Spec §19/§20/§48: opening hours, admission, contact details and coordinates must never
 * be invented. isVerified stays false until the owner supplies real values through the
 * future site-settings admin screen. Fields still pending are left as empty strings —
 * templates hide those rows rather than showing a raw "TODO" marker to visitors.
 * `address`, `latitude`/`longitude`, `openingHours`, `phone`, `instagram` and `facebook` are now
 * owner-provided and real; `email`, `tripadvisorUrl`, `googleMapsUrl` and
 * `admissionInfo` are still pending.
 */
const DEMO_SETTINGS: SiteSettings = {
  address: '46/3 Moo 3, Soi 5, Huay Sai, Mae Rim, Chiang Mai 50180, Thailand',
  latitude: 18.97812,
  longitude: 98.916107,
  phone: '083 318 4855',
  email: '',
  instagram: 'https://www.instagram.com/eroticgardenandteahouse/',
  facebook: 'https://www.facebook.com/eroticgarden/?locale=th_TH',
  tripadvisorUrl: '',
  googleMapsUrl: '',
  openingHours: [
    { days: 'Monday', hours: 'Closed' },
    { days: 'Tuesday', hours: 'Closed' },
    { days: 'Wednesday', hours: '10:00–16:00' },
    { days: 'Thursday', hours: '10:00–16:00' },
    { days: 'Friday', hours: '10:00–16:00' },
    { days: 'Saturday', hours: '10:00–16:00' },
    { days: 'Sunday', hours: '10:00–16:00' },
  ],
  admissionInfo: '',
  isVerified: false,
};

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  get(): Observable<SiteSettings> {
    return of(DEMO_SETTINGS);
  }
}
