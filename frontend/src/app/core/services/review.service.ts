import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Review, ReviewSourceSummary, ReviewSummary } from '../models/review.model';

/**
 * Spec §18/§48: reviews must never be fabricated or scraped. No live API integration —
 * averageRating/totalReviews/profileUrl below are the owner-confirmed numbers and real
 * listing URLs, checked directly on Google Maps and Tripadvisor. Update only with
 * owner-confirmed values; never estimate or scrape. Individual review quotes are
 * intentionally still not collected/stored — DEMO_REVIEWS stays empty.
 */
const DEMO_REVIEWS: Review[] = [];

const DEMO_SUMMARY: ReviewSummary = {
  averageRating: 0,
  totalReviews: 0,
};

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
