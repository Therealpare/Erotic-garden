import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

/**
 * Orderable products. Only one real SKU exists today (owner-confirmed price);
 * the array shape is deliberate so more products/sizes can be added later
 * without changing the cart/checkout code that consumes this list.
 */
const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'coffee-beans-100g',
    name: 'Coffee Beans',
    size: '100g',
    price: 350,
    currency: 'THB',
    imageUrl: 'images/garden/cof2.webp',
    altText: 'A dark bag of Erotic Garden single origin arabica coffee, standing on a wooden table',
    available: true,
  },
];

@Injectable({ providedIn: 'root' })
export class ProductService {
  getAll(): Observable<Product[]> {
    return of(PRODUCTS);
  }
}
