import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CoffeeProduct } from '../models/coffee-product.model';
import { ProductService } from './product.service';

/**
 * The Coffee page's "Collection" showcase: every photo of every product, with the
 * owner-entered origin/process/roast/tasting details (blank rows stay hidden, spec §48).
 * Sourced from the same products as the shop, so admins manage both in /admin/coffee.
 */
@Injectable({ providedIn: 'root' })
export class CoffeeService {
  private readonly productService = inject(ProductService);

  getAll(): Observable<CoffeeProduct[]> {
    return this.productService.getAll().pipe(
      map((products) =>
        products.flatMap((product) =>
          product.images.map((image, index) => ({
            id: product.id * 1000 + index,
            name: product.name.en,
            weight: '',
            origin: index === 0 ? (product.origin ?? '') : '',
            process: index === 0 ? (product.process ?? '') : '',
            roastLevel: index === 0 ? (product.roastLevel ?? '') : '',
            tastingNotes: index === 0 ? (product.tastingNotes ?? '') : '',
            price: '',
            imageUrl: image.imageUrl,
            altText: image.altText,
            localizedName: product.name,
          })),
        ),
      ),
    );
  }
}
