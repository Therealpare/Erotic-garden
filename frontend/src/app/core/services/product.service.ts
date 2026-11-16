import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { API_BASE_URL, isApiConfigured } from '../config/api.config';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { resolveImageUrl } from '../../shared/utils/image-url.util';
import { parseCsv } from '../../shared/utils/csv.util';
import { productsFromSheet } from '../../shared/utils/products-sheet.util';

/** Last copy of the sheet shipped with the site (keep in step with the Google Sheet). */
const SNAPSHOT_URL = 'data/products.csv';

/**
 * Coffee and other products with their sizes, prices and availability.
 *
 * - With the API (local development with the backend): products managed in /admin/coffee.
 * - Otherwise (the live site): the owner's Google Sheet (environment.productsSheetUrl),
 *   falling back to the bundled snapshot when the sheet is not set or can't be read.
 *
 * Pre-orders are sent to the garden's LINE account, so ordering never needs the API.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    if (isApiConfigured()) {
      return this.http.get<Product[]>(`${API_BASE_URL}/products`).pipe(
        map((products) =>
          products.map((product) => ({
            ...product,
            images: product.images.map((image) => ({ ...image, imageUrl: resolveImageUrl(image.imageUrl) })),
          })),
        ),
      );
    }
    const snapshot = () => this.readCsv(SNAPSHOT_URL);
    if (!environment.productsSheetUrl) return snapshot();
    return this.readCsv(environment.productsSheetUrl).pipe(
      map((products) => {
        if (!products.length) throw new Error('The products sheet has no usable rows');
        return products;
      }),
      catchError(() => snapshot()),
    );
  }

  private readCsv(url: string): Observable<Product[]> {
    return this.http.get(url, { responseType: 'text' }).pipe(map((text) => productsFromSheet(parseCsv(text))));
  }
}
