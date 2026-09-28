import { Injectable } from '@nestjs/common';
import { SiteSettings } from './entities/site-settings.entity';

/**
 * `address`, `latitude`/`longitude`, `openingHours`, `instagram` and `facebook` are
 * owner-provided and real; `phone`, `email` and `admissionInfo` are still placeholders
 * pending owner-verified content (spec §48). Keep this in sync with the frontend's
 * SiteSettingsService until Phase 6 removes the frontend mock in favor of this API.
 */
const SETTINGS: SiteSettings = {
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

@Injectable()
export class SiteSettingsService {
  get(): SiteSettings {
    return SETTINGS;
  }
}
