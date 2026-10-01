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
 * Per-platform rating summary (spec §18/§48) — no live API integration for now, by
 * design. averageRating/totalReviews must only ever be the owner-confirmed numbers
 * read directly from the business's real Google Maps and Tripadvisor listings (never
 * scraped, never estimated), and profileUrl is that listing's real URL. Both stay at
 * their zero/empty defaults — and the card for that platform stays hidden — until the
 * owner provides the confirmed values.
 */
export type ReviewPlatform = 'GOOGLE' | 'TRIPADVISOR';

export interface ReviewSourceSummary {
  platform: ReviewPlatform;
  averageRating: number;
  totalReviews: number;
  profileUrl: string;
}
