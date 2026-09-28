import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(): Review[] {
    return this.reviewsService.findAll();
  }

  @Get('featured')
  findFeatured(): Review[] {
    return this.reviewsService.findFeatured();
  }
}
