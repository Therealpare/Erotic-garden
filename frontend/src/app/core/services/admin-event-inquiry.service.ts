import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { EventInquiry, InquiryStatus, Paginated } from '../models/event-inquiry.model';

export interface InquiryQuery {
  status?: InquiryStatus;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminEventInquiryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/admin/event-inquiries`;

  list(query: InquiryQuery): Observable<Paginated<EventInquiry>> {
    let params = new HttpParams();
    if (query.status) params = params.set('status', query.status);
    if (query.search?.trim()) params = params.set('search', query.search.trim());
    if (query.page) params = params.set('page', query.page);
    if (query.limit) params = params.set('limit', query.limit);
    return this.http.get<Paginated<EventInquiry>>(this.baseUrl, { params });
  }

  get(id: number): Observable<EventInquiry> {
    return this.http.get<EventInquiry>(`${this.baseUrl}/${id}`);
  }

  update(id: number, changes: { status?: InquiryStatus; adminNotes?: string }): Observable<EventInquiry> {
    return this.http.patch<EventInquiry>(`${this.baseUrl}/${id}`, changes);
  }
}
