import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Mocks POST /api/v1/contact until the NestJS backend exists (spec Phase 4/5).
 * Swap the body for an HttpClient call once that endpoint is live.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  submit(payload: ContactPayload): Observable<{ success: true }> {
    return of({ success: true as const }).pipe(delay(600));
  }
}
