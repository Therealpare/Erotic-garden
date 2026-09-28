import { Injectable } from '@nestjs/common';
import { GalleryCategory, GalleryImage } from './entities/gallery.entity';

/** Demo gallery content — placeholder imagery pending real photography (spec §17/§48). */
const CATEGORIES: GalleryCategory[] = [
  { id: 1, name: 'Garden', slug: 'garden' },
  { id: 2, name: 'Art', slug: 'art' },
  { id: 3, name: 'Tea House', slug: 'tea-house' },
  { id: 4, name: 'People', slug: 'people' },
];

function image(
  id: number,
  categorySlug: GalleryImage['categorySlug'],
  title: string,
): GalleryImage {
  return {
    id,
    categorySlug,
    title,
    imageUrl: `https://picsum.photos/seed/eg-gallery-${id}/900/1100`,
    publicId: `eg-gallery-${id}`,
    description: 'Demo image — pending real photography.',
    altText: `Demo photograph for ${title}`,
    featured: id % 4 === 0,
    sortOrder: id,
    createdAt: new Date(),
  };
}

const IMAGES: GalleryImage[] = [
  image(1, 'garden', 'Garden path'),
  image(2, 'art', 'Sculpture detail'),
  image(3, 'tea-house', 'Tea house interior'),
  image(4, 'garden', 'Morning light in the garden'),
  image(5, 'people', 'Visitors walking the grounds'),
  image(6, 'art', 'Installation among the trees'),
  image(7, 'garden', 'Reflection pond'),
  image(8, 'tea-house', 'Tea service'),
  image(9, 'people', 'A quiet moment on the terrace'),
  image(10, 'art', 'Stone carving close-up'),
  image(11, 'garden', 'Bamboo corridor'),
  image(12, 'tea-house', 'Homemade treats'),
];

@Injectable()
export class GalleryService {
  findCategories(): GalleryCategory[] {
    return CATEGORIES;
  }

  findAll(category?: GalleryImage['categorySlug']): GalleryImage[] {
    return category
      ? IMAGES.filter((image) => image.categorySlug === category)
      : IMAGES;
  }
}
