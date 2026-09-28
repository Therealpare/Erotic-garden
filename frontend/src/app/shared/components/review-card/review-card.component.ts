import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css',
})
export class ReviewCardComponent {
  review = input.required<Review>();

  readonly sourceLabels: Record<Review['source'], string> = {
    TRIPADVISOR: 'Tripadvisor',
    GOOGLE: 'Google',
    DIRECT: 'Direct',
  };

  get stars(): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  isFilled(star: number): boolean {
    return star < this.review().rating;
  }
}
