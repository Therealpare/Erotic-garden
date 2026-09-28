export class OpeningHoursEntry {
  days: string;
  hours: string;
}

/**
 * Spec §35 stores this as flat setting_key/setting_value rows; exposed here as one
 * structured object to match what the frontend (and spec §19/§20) actually consumes.
 * Never invent values here — see spec §48.
 */
export class SiteSettings {
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  tripadvisorUrl: string;
  googleMapsUrl: string;
  openingHours: OpeningHoursEntry[];
  admissionInfo: string;
  isVerified: boolean;
}
