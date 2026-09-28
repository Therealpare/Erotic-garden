export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

/** Mirrors spec §27/§35 `bookings` table. */
export class Booking {
  id: number;
  bookingCode: string;
  name: string;
  email: string;
  phone: string;
  visitDate: string;
  preferredTime: string;
  guestCount: number;
  experienceId: number;
  message: string;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}
