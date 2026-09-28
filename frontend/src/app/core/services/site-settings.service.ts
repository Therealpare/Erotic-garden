import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SiteSettings } from '../models/site-settings.model';

/**
 * Spec §19/§20/§48: opening hours, admission, contact details and coordinates must never
 * be invented. isVerified stays false until the owner supplies real values through the
 * future site-settings admin screen — templates must branch on it rather than hard-coding facts.
 * `address` is now owner-provided and real; every other field is still a placeholder.
 */
const DEMO_SETTINGS: SiteSettings = {
  address: '46/3 Moo 3, Soi 5, Huay Sai, Mae Rim, Chiang Mai 50180, Thailand',
  phone: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
  email: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
  instagram: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
  facebook: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
  tripadvisorUrl: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
  googleMapsUrl: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
  openingHours: [{ days: 'TODO', hours: 'OWNER VERIFIED CONTENT REQUIRED' }],
  admissionInfo: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
  isVerified: false,
};

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  get(): Observable<SiteSettings> {
    return of(DEMO_SETTINGS);
  }
}
