import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GalleryCategory, GalleryImage } from '../models/gallery.model';

/** Demo gallery content — placeholder imagery pending real photography (spec §17/§48). */
const DEMO_CATEGORIES: GalleryCategory[] = [
  { id: 1, name: 'Garden', slug: 'garden' },
  { id: 2, name: 'Art', slug: 'art' },
  { id: 3, name: 'Tea House', slug: 'tea-house' },
  { id: 4, name: 'People', slug: 'people' },
];

function image(id: number, categorySlug: GalleryImage['categorySlug'], title: string, ratio: string): GalleryImage {
  return {
    id,
    categorySlug,
    title,
    imageUrl: `https://picsum.photos/seed/eg-gallery-${id}/${ratio}`,
    description: 'Demo image — pending real photography.',
    altText: `Demo photograph for ${title}`,
    featured: id % 4 === 0,
    sortOrder: id,
  };
}

const DEMO_IMAGES: GalleryImage[] = [
  image(1, 'garden', 'Garden path', '900/1200'),
  image(2, 'art', 'Sculpture detail', '900/700'),
  image(3, 'tea-house', 'Tea house interior', '900/1100'),
  image(4, 'garden', 'Morning light in the garden', '900/1300'),
  image(5, 'people', 'Visitors walking the grounds', '900/650'),
  image(6, 'art', 'Installation among the trees', '900/1150'),
  image(7, 'garden', 'Reflection pond', '900/750'),
  image(8, 'tea-house', 'Tea service', '900/1000'),
  image(9, 'people', 'A quiet moment on the terrace', '900/1200'),
  image(10, 'art', 'Stone carving close-up', '900/900'),
  image(11, 'garden', 'Bamboo corridor', '900/1250'),
  image(12, 'tea-house', 'Homemade treats', '900/700'),
];

@Injectable({ providedIn: 'root' })
export class GalleryService {
  getCategories(): Observable<GalleryCategory[]> {
    return of(DEMO_CATEGORIES);
  }

  getAll(): Observable<GalleryImage[]> {
    return of(DEMO_IMAGES);
  }
}
