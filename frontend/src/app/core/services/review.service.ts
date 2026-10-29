import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ReviewSourceSummary } from '../models/review.model';

/**
 * Spec §18/§48: reviews must never be fabricated or scraped.
 *
 * getSourceSummaries() — the Google/Tripadvisor rating + review-count cards — stays
 * static: averageRating/totalReviews/profileUrl are the owner-confirmed numbers and
 * real listing URLs, checked directly on Google Maps and Tripadvisor. Update only with
 * owner-confirmed values.
 *
 * Individual review text is intentionally not fetched from any API: Tripadvisor has
 * no self-serve content API, and the Google Places API dependency was removed by
 * request. Individual review content is shown only via Tripadvisor's own official
 * embeddable widget (see TripadvisorWidgetComponent + core/config/tripadvisor.config.ts).
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
  getSourceSummaries(): Observable<ReviewSourceSummary[]> {
    return of(DEMO_SOURCE_SUMMARIES);
  }
}
