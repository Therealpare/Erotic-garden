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
];

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
