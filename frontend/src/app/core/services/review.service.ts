import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Review, ReviewSourceSummary } from '../models/review.model';

/**
 * Spec §18/§48: reviews must never be fabricated or scraped.
 *
 * getSourceSummaries() — the Google/Tripadvisor rating + review-count cards — stays
 * static: averageRating/totalReviews/profileUrl are the owner-confirmed numbers and
 * real listing URLs, checked directly on Google Maps and Tripadvisor. Update only with
 * owner-confirmed values.
 *
 * getGoogleReviews() calls the real Google Places API via a Vercel serverless function
 * (frontend/api/reviews-google.ts), which returns an empty array until
 * GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID are configured — see that file's comment
 * for exact setup steps. Individual review text is never hard-coded here; it is always
 * whatever the live API call returns, capped at Google's own 5-review limit.
 *
 * Tripadvisor has no equivalent self-serve review API — individual review content for
 * that platform is shown via Tripadvisor's own official embeddable widget instead (see
 * TripadvisorWidgetComponent + core/config/tripadvisor.config.ts), not this service.
 */
const DEMO_SOURCE_SUMMARIES: ReviewSourceSummary[] = [
  {
    platform: 'GOOGLE',
    averageRating: 4.6,
    totalReviews: 277,
    profileUrl: 'https://www.google.com/maps/search/?api=1&query=Chiang%20Mai%20Erotic%20Garden',
  },
  {
    platform: 'TRIPADVISOR',
    averageRating: 4.7,
    totalReviews: 98,
    profileUrl:
      'https://th.tripadvisor.com/Attraction_Review-g1766192-d8536927-Reviews-Chiang_Mai_Erotic_Garden-Mae_Rim.html',
  },
];

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);

  getSourceSummaries(): Observable<ReviewSourceSummary[]> {
    return of(DEMO_SOURCE_SUMMARIES);
  }

  getGoogleReviews(): Observable<Review[]> {
    return this.http.get<Review[]>('/api/reviews-google').pipe(catchError(() => of([])));
  }
}
