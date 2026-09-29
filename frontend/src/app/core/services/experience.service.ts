import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Experience } from '../models/experience.model';

/**
 * Demo bookable experiences (spec §24). Durations and prices are placeholders pending
 * owner-verified content (spec §48) — never presented as real pricing.
 */
const DEMO_EXPERIENCES: Experience[] = [
  {
    id: 1,
    title: 'Garden Tour',
    slug: 'garden-tour',
    shortDescription: 'A guided walk through the garden’s sculptures and planting.',
    description: 'Demo content — pending owner-verified experience details.',
    duration: '',
    price: '',
    imageUrl: 'images/garden/ero12.webp',
    featured: true,
    status: 'PUBLISHED',
  },
  {
    id: 2,
    title: 'Art Exploration',
    slug: 'art-exploration',
    shortDescription: 'A closer look at the artists and stories behind each installation.',
    description: 'Demo content — pending owner-verified experience details.',
    duration: '',
    price: '',
    imageUrl: 'images/garden/ero9.webp',
    featured: true,
    status: 'PUBLISHED',
  },
  {
    id: 3,
    title: 'Tea House',
    slug: 'tea-house-experience',
    shortDescription: 'Slow down with tea, coffee and homemade treats overlooking the garden.',
    description: 'Demo content — pending owner-verified experience details.',
    duration: '',
    price: '',
    imageUrl: 'images/garden/ero16.webp',
    featured: true,
    status: 'PUBLISHED',
  },
  {
    id: 4,
    title: 'Private / Group Visit',
    slug: 'private-group-visit',
    shortDescription: 'A tailored visit for private groups and special occasions.',
    description: 'Demo content — pending owner-verified experience details.',
    duration: '',
    price: '',
    imageUrl: 'images/garden/ero22.webp',
    featured: false,
    status: 'PUBLISHED',
  },
];

@Injectable({ providedIn: 'root' })
export class ExperienceService {
  getAll(): Observable<Experience[]> {
    return of(DEMO_EXPERIENCES);
  }

  getFeatured(): Observable<Experience[]> {
    return of(DEMO_EXPERIENCES.filter((experience) => experience.featured));
  }

  getBySlug(slug: string): Observable<Experience | undefined> {
    return of(DEMO_EXPERIENCES.find((experience) => experience.slug === slug));
  }
}
