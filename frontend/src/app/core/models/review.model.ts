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
