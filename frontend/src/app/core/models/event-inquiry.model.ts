export type EventType = 'WEDDING' | 'PRIVATE_PARTY' | 'CORPORATE' | 'PHOTOSHOOT' | 'WORKSHOP' | 'OTHER';
export const EVENT_TYPES: EventType[] = ['WEDDING', 'PRIVATE_PARTY', 'CORPORATE', 'PHOTOSHOOT', 'WORKSHOP', 'OTHER'];

export type ContactPreference = 'EMAIL' | 'PHONE' | 'LINE';
export const CONTACT_PREFERENCES: ContactPreference[] = ['EMAIL', 'PHONE', 'LINE'];

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'QUOTED' | 'CONFIRMED' | 'DECLINED' | 'CLOSED';
export const INQUIRY_STATUSES: InquiryStatus[] = ['NEW', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'DECLINED', 'CLOSED'];

export interface EventInquiryRequest {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  eventType: EventType;
  preferredDate: string;
  flexibleDate: boolean;
  guestCount: number;
  contactPreference: ContactPreference;
  lineId?: string;
  message: string;
  consent: boolean;
  /** Honeypot — always empty for real visitors. */
  website?: string;
}

export interface EventInquiryReceipt {
  referenceCode: string;
  status: 'RECEIVED';
}

export interface EventInquiry {
  id: number;
  referenceCode: string;
  name: string;
  email: string;
  phone: string;
  organization: string | null;
  eventType: EventType;
  preferredDate: string;
  flexibleDate: boolean;
  guestCount: number;
  contactPreference: ContactPreference;
  lineId: string | null;
  message: string;
  status: InquiryStatus;
  adminNotes: string | null;
  lineNotifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
