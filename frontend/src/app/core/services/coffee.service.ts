import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CoffeeProduct } from '../models/coffee-product.model';

/**
 * Real Erotic Garden coffee products, photographed from the owner's own packaging.
 * Per-bag origin/process/roast/tasting-note specs and pricing are printed in small
 * type on the bags but not yet owner-confirmed as site copy (spec §48), so they are
 * left blank here — templates hide those rows rather than guessing from the photos.
 */
const COFFEE_PRODUCTS: CoffeeProduct[] = [
  {
    id: 1,
    name: 'Erotic Garden Single Origin Arabica Coffee',
    weight: '100g',
    origin: '',
    process: '',
    roastLevel: '',
    tastingNotes: '',
    price: '',
    imageUrl: 'images/garden/cof1-3.webp',
    altText: 'A red bag of Erotic Garden single origin arabica coffee',
  },
  {
    id: 2,
    name: 'Erotic Garden Single Origin Arabica Coffee',
    weight: '100g',
    origin: '',
    process: '',
    roastLevel: '',
    tastingNotes: '',
    price: '',
    imageUrl: 'images/garden/cof2.webp',
    altText: 'A dark bag of Erotic Garden single origin arabica coffee, standing on a wooden table',
  },
  {
    id: 3,
    name: 'Erotic Garden Single Origin Arabica Coffee',
    weight: '250g',
    origin: '',
    process: '',
    roastLevel: '',
    tastingNotes: '',
    price: '',
    imageUrl: 'images/garden/cof4.webp',
    altText: 'A green bag of Erotic Garden single origin arabica coffee',
  },
];

@Injectable({ providedIn: 'root' })
export class CoffeeService {
  getAll(): Observable<CoffeeProduct[]> {
    return of(COFFEE_PRODUCTS);
  }
}
