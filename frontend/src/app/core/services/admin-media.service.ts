import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { MediaItem, MediaItemInput, MediaStatus, MediaType } from '../models/media.model';

@Injectable({ providedIn: 'root' })
export class AdminMediaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/admin/media`;

  list(filters: { type?: MediaType; status?: MediaStatus } = {}): Observable<MediaItem[]> {
    let params = new HttpParams();
    if (filters.type) params = params.set('type', filters.type);
    if (filters.status) params = params.set('status', filters.status);
    return this.http.get<MediaItem[]>(this.baseUrl, { params });
  }

  get(id: number): Observable<MediaItem> {
    return this.http.get<MediaItem>(`${this.baseUrl}/${id}`);
  }

  create(input: MediaItemInput): Observable<MediaItem> {
    return this.http.post<MediaItem>(this.baseUrl, input);
  }

  update(id: number, input: Partial<MediaItemInput>): Observable<MediaItem> {
    return this.http.patch<MediaItem>(`${this.baseUrl}/${id}`, input);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
