export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  visitDate: string;
  preferredTime: string;
  guestCount: number;
  experienceId: number | null;
  message: string;
}

export interface BookingConfirmation {
  bookingCode: string;
  status: BookingStatus;
}
