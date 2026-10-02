import { Injectable } from '@nestjs/common';
import { SiteSettings } from './entities/site-settings.entity';

/**
 * `address`, `latitude`/`longitude`, `openingHours`, `phone`, `instagram` and `facebook` are
 * owner-provided and real; `email` and `admissionInfo` are still placeholders
 * pending owner-verified content (spec §48). Keep this in sync with the frontend's
 * SiteSettingsService until Phase 6 removes the frontend mock in favor of this API.
 */
const SETTINGS: SiteSettings = {
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

@Injectable()
export class SiteSettingsService {
  get(): SiteSettings {
    return SETTINGS;
  }
}
