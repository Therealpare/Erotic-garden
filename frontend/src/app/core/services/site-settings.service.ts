import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SiteSettings } from '../models/site-settings.model';

/**
 * Spec §19/§20/§48: opening hours, admission, contact details and coordinates must never
 * be invented. isVerified stays false until the owner supplies real values through the
 * future site-settings admin screen — templates must branch on it rather than hard-coding facts.
 * `address`, `latitude`/`longitude`, `openingHours`, `instagram` and `facebook` are now
 * owner-provided and real; `phone`, `email` and `admissionInfo` are still placeholders.
 */
const DEMO_SETTINGS: SiteSettings = {
  address: '46/3 Moo 3, Soi 5, Huay Sai, Mae Rim, Chiang Mai 50180, Thailand',
  latitude: 18.97812,
  longitude: 98.916107,
  phone: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
  email: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
  instagram: 'https://www.instagram.com/eroticgardenandteahouse/',
  facebook: 'https://www.facebook.com/eroticgarden/?locale=th_TH',
  tripadvisorUrl: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
  googleMapsUrl: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
  openingHours: [
    { days: 'Monday–Tuesday', hours: 'Closed' },
    { days: 'Wednesday–Sunday', hours: '10:00–16:00' },
  ],
  admissionInfo: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
  isVerified: false,
};

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  get(): Observable<SiteSettings> {
    return of(DEMO_SETTINGS);
  }
}
