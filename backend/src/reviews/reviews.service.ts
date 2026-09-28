import { Injectable } from '@nestjs/common';
import { Review } from './entities/review.entity';

/**
 * Spec §18/§48: reviews must never be fabricated. No real reviews exist yet, so this
 * intentionally returns an empty list until real Tripadvisor/Google/Direct reviews are
 * imported through the admin CMS (Phase 8).
 */
const REVIEWS: Review[] = [];

@Injectable()
export class ReviewsService {
  findAll(): Review[] {
    return REVIEWS.filter((review) => review.status === 'PUBLISHED');
  }

  findFeatured(): Review[] {
    return this.findAll().filter((review) => review.featured);
  }
}
