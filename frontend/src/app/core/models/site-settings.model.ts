export interface OpeningHoursEntry {
  days: string;
  hours: string;
}

export interface SiteSettings {
  address: string;
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
