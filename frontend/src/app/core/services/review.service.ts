import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Review, ReviewSourceSummary, ReviewSummary } from '../models/review.model';

/**
 * Spec §18/§48: reviews must never be fabricated or scraped. No live API integration
 * for now — averageRating/totalReviews/profileUrl below must only ever be replaced
 * with the owner-confirmed numbers and real listing URLs, checked directly on Google
 * Maps and Tripadvisor. Until then they stay at their empty defaults, and the UI hides
 * each platform's card independently (and the whole section falls back to an honest
 * empty state if neither is confirmed).
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
