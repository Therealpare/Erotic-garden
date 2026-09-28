import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Review, ReviewSummary } from '../models/review.model';

/**
 * Spec §18/§48: reviews must never be fabricated. No real reviews exist yet, so this
 * service intentionally returns an empty list and an unverified summary — the UI must
 * render an honest empty state rather than invented testimonials.
 */
const DEMO_REVIEWS: Review[] = [];

const DEMO_SUMMARY: ReviewSummary = {
  averageRating: 0,
  totalReviews: 0,
};

@Injectable({ providedIn: 'root' })
export class ReviewService {
  getFeatured(): Observable<Review[]> {
    return of(DEMO_REVIEWS);
  }

  getSummary(): Observable<ReviewSummary> {
    return of(DEMO_SUMMARY);
  }
}
