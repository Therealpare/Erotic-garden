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
 * Per-platform rating summary (spec §18) — intended to come from the Google
 * Places API and a Tripadvisor widget/API once connected. Never populate
 * averageRating/totalReviews by scraping; leave them at 0 until a real
 * integration provides verified numbers. profileUrl drives the "Read all
 * reviews" link and should likewise stay empty until the owner confirms it.
 */
export type ReviewPlatform = 'GOOGLE' | 'TRIPADVISOR';

export interface ReviewSourceSummary {
  platform: ReviewPlatform;
  averageRating: number;
  totalReviews: number;
  profileUrl: string;
}
