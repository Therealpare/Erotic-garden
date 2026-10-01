import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Review, ReviewSourceSummary, ReviewSummary } from '../models/review.model';

/**
 * Spec §18/§48: reviews must never be fabricated. No real reviews, ratings, or review
 * counts exist yet — this service intentionally returns empty/zeroed data so the UI
 * renders an honest empty state rather than invented testimonials or scraped numbers.
 *
 * Swap getSourceSummaries()/getFeatured() for real calls once Google Places API and a
 * Tripadvisor API/widget are connected (never scrape either platform directly).
 */
const DEMO_REVIEWS: Review[] = [];

const DEMO_SUMMARY: ReviewSummary = {
  averageRating: 0,
  totalReviews: 0,
};

const DEMO_SOURCE_SUMMARIES: ReviewSourceSummary[] = [
  { platform: 'GOOGLE', averageRating: 0, totalReviews: 0, profileUrl: '' },
  { platform: 'TRIPADVISOR', averageRating: 0, totalReviews: 0, profileUrl: '' },
];

@Injectable({ providedIn: 'root' })
export class ReviewService {
  getFeatured(): Observable<Review[]> {
    return of(DEMO_REVIEWS);
  }

  getSummary(): Observable<ReviewSummary> {
    return of(DEMO_SUMMARY);
  }

  getSourceSummaries(): Observable<ReviewSourceSummary[]> {
    return of(DEMO_SOURCE_SUMMARIES);
  }
}
