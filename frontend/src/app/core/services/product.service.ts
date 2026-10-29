import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { API_BASE_URL, isApiConfigured } from '../config/api.config';
import { Product } from '../models/product.model';
import { resolveImageUrl } from '../../shared/utils/image-url.util';

/**
 * Coffee products with their sizes, prices and live stock (managed in /admin/coffee).
 * Without an API there is nothing that can take an order, so the offline fallback shows
 * the confirmed product for display only, with every size marked unavailable.
 */
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'coffee-beans',
    name: { en: 'Coffee Beans', th: 'เมล็ดกาแฟ', de: 'Kaffeebohnen' },
    description: {},
    origin: null,
    process: null,
    roastLevel: null,
    altitude: null,
    body: null,
    tastingNotes: null,
    images: [
      {
        imageUrl: 'images/garden/cof2.webp',
        altText: 'A dark bag of Erotic Garden single origin arabica coffee, standing on a wooden table',
        sortOrder: 0,
      },
    ],
    variants: [{ id: 0, label: '100g', price: 350, currency: 'THB', stock: 0, soldOut: true }],
  },
  // The three bags in the owner's photos, with details exactly as printed on each label.
  // No sizes or prices have been confirmed for them, so they are not offered in the shop.
  labelProfile(2, 'khun-chang-khian-honey', { en: 'Khun Chang Khian', th: 'ขุนช่างเคี่ยน', de: 'Khun Chang Khian' }, {
    origin: 'Khun Chang Khian',
    process: 'Honey',
    altitude: '1,200 – 1,400 MASL',
    roastLevel: 'Light',
    tastingNotes: 'White floral, lemon, apple, honey',
    body: 'Smooth body',
    altText: 'Yellow bag of Erotic Garden single origin coffee from Khun Chang Khian, honey process, light roast',
  }),
  labelProfile(3, 'pangkhum-natural', { en: 'Pangkhum', th: 'ปางขุม', de: 'Pangkhum' }, {
    origin: 'Pangkhum',
    process: 'Natural',
    altitude: '1,400 MASL',
    roastLevel: 'Light-Medium',
    tastingNotes: 'Berry, floral, rosé wine, stone fruit, chocolate',
    body: 'Full body',
    altText: 'Red bag of Erotic Garden single origin coffee from Pangkhum, natural process, light-medium roast',
  }),
  labelProfile(4, 'mae-poon-luang-washed', { en: 'Mae Poon Luang', th: 'แม่พูนหลวง', de: 'Mae Poon Luang' }, {
    origin: 'Mae Poon Luang',
    process: 'Washed',
    altitude: '1,300 MASL',
    roastLevel: 'Medium-Dark',
    tastingNotes: 'White flowers, honey, oolong tea',
    body: 'Full body',
    altText: 'Blue bag of Erotic Garden single origin coffee from Mae Poon Luang, washed process, medium-dark roast',
  }),
];

function labelProfile(
  id: number,
  slug: string,
  name: Product['name'],
  label: Pick<Product, 'origin' | 'process' | 'altitude' | 'roastLevel' | 'tastingNotes' | 'body'> & { altText: string },
): Product {
  const { altText, ...details } = label;
  return {
    id,
    slug,
    name,
    description: {},
    ...details,
    images: [{ imageUrl: `images/coffee/${slug}.webp`, altText, sortOrder: 0 }],
    variants: [],
  };
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  /** True when products come from the live API, i.e. ordering is possible. */
  readonly isLive = isApiConfigured;

  getAll(): Observable<Product[]> {
    if (!isApiConfigured()) return of(FALLBACK_PRODUCTS);
    return this.http.get<Product[]>(`${API_BASE_URL}/products`).pipe(
      map((products) =>
        products.map((product) => ({
          ...product,
          images: product.images.map((image) => ({ ...image, imageUrl: resolveImageUrl(image.imageUrl) })),
        })),
      ),
    );
  }
}
