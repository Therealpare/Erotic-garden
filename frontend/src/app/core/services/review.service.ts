import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Review, ReviewSourceSummary, ReviewSummary } from '../models/review.model';

/**
 * Spec §18/§48: reviews must never be fabricated. No real individual review quotes
 * exist yet, so getFeatured()/getSummary() intentionally return empty/zeroed data —
 * the UI renders an honest empty state rather than invented testimonials.
 *
 * getGoogleSummary() calls the real Google Places API via a Vercel serverless function
 * (frontend/api/reviews-google.ts), which itself returns zeroed/empty data until the
 * GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID environment variables are configured — see
 * that file's comment for exact setup steps. Never scrape Google or Tripadvisor.
 */
const DEMO_REVIEWS: Review[] = [];

const DEMO_SUMMARY: ReviewSummary = {
  averageRating: 0,
  totalReviews: 0,
};

const EMPTY_SOURCE_SUMMARY: ReviewSourceSummary = { averageRating: 0, totalReviews: 0, profileUrl: '' };

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);

  getFeatured(): Observable<Review[]> {
    return of(DEMO_REVIEWS);
  }

  getSummary(): Observable<ReviewSummary> {
    return of(DEMO_SUMMARY);
  }

  getGoogleSummary(): Observable<ReviewSourceSummary> {
    return this.http
      .get<ReviewSourceSummary>('/api/reviews-google')
      .pipe(catchError(() => of(EMPTY_SOURCE_SUMMARY)));
  }
}
