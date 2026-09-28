import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { BookingConfirmation, BookingRequest } from '../models/booking.model';

/**
 * Mocks POST /api/v1/bookings until the NestJS backend exists (spec Phase 4/5).
 * The real backend generates the booking code server-side on insert; this mock
 * generates one client-side only so the confirmation UI has something real to show.
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  submit(payload: BookingRequest): Observable<BookingConfirmation> {
    const code = this.generateBookingCode();
    return of({ bookingCode: code, status: 'PENDING' as const }).pipe(delay(700));
  }

  private generateBookingCode(): string {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `EG-${random}`;
  }
}
