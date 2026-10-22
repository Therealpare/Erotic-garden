import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { API_BASE_URL, isApiConfigured } from '../config/api.config';
import { MediaItem, MediaType } from '../models/media.model';

/**
 * Public media library (GET /api/v1/media). Read failures resolve to "nothing to show"
 * so a missing or unreachable API hides media sections instead of breaking the page.
 */
@Injectable({ providedIn: 'root' })
export class MediaService {
  private readonly http = inject(HttpClient);

  getPublished(type?: MediaType): Observable<MediaItem[]> {
    if (!isApiConfigured()) return of([]);
    const params = type ? new HttpParams().set('type', type) : undefined;
    return this.http.get<MediaItem[]>(`${API_BASE_URL}/media`, { params }).pipe(catchError(() => of([])));
  }

  getFeaturedVideo(): Observable<MediaItem | null> {
    if (!isApiConfigured()) return of(null);
    return this.http.get<{ item: MediaItem | null }>(`${API_BASE_URL}/media/featured`).pipe(
      map((response) => response.item),
      catchError(() => of(null)),
    );
  }
}
