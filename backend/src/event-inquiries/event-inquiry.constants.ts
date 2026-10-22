export type EventType =
  | 'WEDDING'
  | 'PRIVATE_PARTY'
  | 'CORPORATE'
  | 'PHOTOSHOOT'
  | 'WORKSHOP'
  | 'OTHER';
export const EVENT_TYPES: EventType[] = [
  'WEDDING',
  'PRIVATE_PARTY',
  'CORPORATE',
  'PHOTOSHOOT',
  'WORKSHOP',
  'OTHER',
];

export type ContactPreference = 'EMAIL' | 'PHONE' | 'LINE';
export const CONTACT_PREFERENCES: ContactPreference[] = [
  'EMAIL',
  'PHONE',
  'LINE',
];

export type InquiryStatus =
  'NEW' | 'CONTACTED' | 'QUOTED' | 'CONFIRMED' | 'DECLINED' | 'CLOSED';
export const INQUIRY_STATUSES: InquiryStatus[] = [
  'NEW',
  'CONTACTED',
  'QUOTED',
  'CONFIRMED',
  'DECLINED',
  'CLOSED',
];
