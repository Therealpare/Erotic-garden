import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { API_BASE_URL, isApiConfigured } from '../config/api.config';
import { EventInquiryReceipt, EventInquiryRequest } from '../models/event-inquiry.model';

@Injectable({ providedIn: 'root' })
export class EventInquiryService {
  private readonly http = inject(HttpClient);

  readonly isAvailable = isApiConfigured;

  submit(payload: EventInquiryRequest): Observable<EventInquiryReceipt> {
    if (!isApiConfigured()) return throwError(() => new Error('API not configured'));
    return this.http.post<EventInquiryReceipt>(`${API_BASE_URL}/event-inquiries`, payload);
  }
}
