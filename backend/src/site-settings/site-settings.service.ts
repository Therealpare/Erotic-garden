import { Injectable } from '@nestjs/common';
import { SiteSettings } from './entities/site-settings.entity';

/**
 * `address` is owner-provided and real; every other field is still a placeholder
 * pending owner-verified content (spec §48). Keep this in sync with the frontend's
 * SiteSettingsService until Phase 6 removes the frontend mock in favor of this API.
 */
const SETTINGS: SiteSettings = {
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

@Injectable()
export class SiteSettingsService {
  get(): SiteSettings {
    return SETTINGS;
  }
}
