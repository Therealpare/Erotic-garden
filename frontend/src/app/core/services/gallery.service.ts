import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GalleryCategory, GalleryImage } from '../models/gallery.model';

/**
 * Gallery content. Garden/Art/People entries below now use real photography supplied
 * by the owner; Tea House entries remain placeholder imagery pending real photography
 * of that space (spec §17/§48).
 */
const DEMO_CATEGORIES: GalleryCategory[] = [
  { id: 1, name: 'Garden', slug: 'garden' },
  { id: 2, name: 'Art', slug: 'art' },
  { id: 3, name: 'Tea House', slug: 'tea-house' },
  { id: 4, name: 'People', slug: 'people' },
];

function placeholderImage(id: number, categorySlug: GalleryImage['categorySlug'], title: string, ratio: string): GalleryImage {
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

function realImage(
  id: number,
  categorySlug: GalleryImage['categorySlug'],
  title: string,
  file: string,
  altText: string,
): GalleryImage {
  return {
    id,
    categorySlug,
    title,
    imageUrl: `images/garden/${file}`,
    description: '',
    altText,
    featured: id % 4 === 0,
    sortOrder: id,
  };
}

const DEMO_IMAGES: GalleryImage[] = [
  realImage(1, 'garden', 'The flowering pergola', 'ero1.webp', 'A flowering pergola shading a garden seating area, with sculptures set among the lawn beyond'),
  realImage(2, 'art', 'Seated figure', 'ero3.webp', 'A pale sculpture of a seated figure, viewed in profile against flowering trees'),
  placeholderImage(3, 'tea-house', 'Tea house interior', '900/1100'),
  realImage(4, 'garden', 'The garden pavilion', 'ero2.webp', 'A garden pavilion draped in flowering orange vines, framed by tropical planting'),
  placeholderImage(5, 'people', 'Visitors walking the grounds', '900/650'),
  realImage(6, 'art', 'Two embracing figures', 'ero7.webp', 'Garden sculpture of two embracing figures, set among palms and clipped hedges'),
  placeholderImage(7, 'garden', 'Reflection pond', '900/750'),
  realImage(8, 'tea-house', 'Erotic Garden coffee, now stocking', 'cof3.webp', 'Three bags of Erotic Garden single origin arabica coffee lined up outdoors'),
  realImage(9, 'people', 'Katai in the garden', 'own.webp', 'Portrait of Katai at the garden'),
  realImage(10, 'art', 'Figural planter', 'ero6.webp', 'Sculpted planter shaped like a figure, filled with trailing petunias'),
  realImage(11, 'garden', 'The seating pavilion', 'ero4.webp', 'A shaded garden pavilion with seating, its curved roofline framed by bougainvillea'),
  placeholderImage(12, 'tea-house', 'Homemade treats', '900/700'),
  realImage(13, 'art', 'Seated figure with a painted bloom', 'ero13.webp', 'A seated sculpture with a painted sunflower motif, framed by tropical leaves'),
  realImage(14, 'art', 'Study through the leaves', 'ero19.webp', "A sculpture's form seen in close abstract detail through lotus leaves"),
  realImage(15, 'art', 'Gilded relief', 'ero11.webp', 'A gilded bas-relief sculpture panel with a winged figure, mounted in the garden'),
  realImage(16, 'art', 'Carved wood, close study', 'ero20.webp', 'A close detail of a carved wooden sculpture beside a garden tree'),
  realImage(17, 'art', 'The painted wall', 'ero21.webp', "A row of painted folk-art figures along the garden building's exterior wall"),
  realImage(18, 'art', 'Carved form among the palms', 'ero23.webp', 'A tall carved garden sculpture in gold and copper tones, set against palms'),
  realImage(19, 'art', 'The flowering planter', 'ero24.webp', 'A bent figural planter sculpture with petunias blooming from its back, on the lawn'),
  realImage(20, 'art', 'Planter in the morning light', 'ero25.webp', 'The same figural planter sculpture seen from a wider angle across the lawn'),
  realImage(21, 'art', 'Garden embrace', 'ero26.webp', 'A pale sculpture of two figures in embrace, seated on a garden path'),
  realImage(22, 'art', 'Reading in the hedge', 'ero27.webp', 'A sculpture of a seated figure reading, framed within a clipped hedge'),
  realImage(23, 'art', 'The kiss', 'ero28.webp', 'A pale sculpture of two seated figures embracing, framed by tropical leaves'),
  realImage(24, 'art', 'Seated figure with painted detail', 'ero29.webp', 'A seated sculpture with a painted design along its side, before flowering shrubs'),
  realImage(25, 'garden', 'Orchid in bloom', 'ero30.webp', 'A cluster of pink and white orchids in the garden, backlit by the afternoon sun'),
  realImage(26, 'garden', 'Lotus at first light', 'ero31.webp', 'A large pink lotus flower in full bloom above the pond'),
  realImage(27, 'garden', 'Flowering vine, close', 'ero32.webp', 'A close view of a small red trumpet-shaped flower among veined leaves'),
  realImage(28, 'garden', 'Beneath the flowering pergola', 'ero33.webp', 'A pergola draped in pink blossoms, with a garden sculpture standing beneath'),
  realImage(29, 'tea-house', 'Erotic Garden coffee, red bag', 'cof1-3.webp', 'A red bag of Erotic Garden single origin arabica coffee'),
  realImage(30, 'tea-house', 'Erotic Garden coffee, black bag', "cof2.webp", 'A dark bag of Erotic Garden single origin arabica coffee, standing on a wooden table'),
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
