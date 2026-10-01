export type ReviewSource = 'TRIPADVISOR' | 'GOOGLE' | 'DIRECT';

export interface Review {
  id: number;
  authorName: string;
  source: ReviewSource;
  rating: number;
  reviewText: string;
  reviewDate: string;
  featured: boolean;
  status: 'PUBLISHED' | 'HIDDEN';
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}

/**
 * Real, API-sourced rating summary for a single review platform (spec §18/§48).
 * Google's summary comes from /api/reviews-google (a Vercel serverless function
 * proxying the Google Places API — see frontend/api/reviews-google.ts). Never
 * populate averageRating/totalReviews by scraping or by hand; they stay at 0
 * until the real API call returns verified numbers, and the UI hides the card
 * accordingly. Tripadvisor has no equivalent self-serve API — it is shown via
 * Tripadvisor's own official embeddable widget instead (see
 * TripadvisorWidgetComponent), not this summary shape.
 */
export interface ReviewSourceSummary {
  averageRating: number;
  totalReviews: number;
  profileUrl: string;
}
