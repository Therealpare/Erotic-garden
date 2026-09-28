export type ReviewSource = 'TRIPADVISOR' | 'GOOGLE' | 'DIRECT';
export type ReviewStatus = 'PUBLISHED' | 'HIDDEN';

export class Review {
  id: number;
  authorName: string;
  source: ReviewSource;
  rating: number;
  reviewText: string;
  reviewDate: string;
  featured: boolean;
  status: ReviewStatus;
}
