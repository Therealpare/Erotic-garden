import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { API_BASE_URL, isApiConfigured } from '../config/api.config';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { resolveImageUrl } from '../../shared/utils/image-url.util';
import { parseCsv } from '../../shared/utils/csv.util';
import { productsFromSheet } from '../../shared/utils/products-sheet.util';
// Bundled with the app, so prerendered pages and offline fallbacks need no request.
import snapshotCsv from '../../../../public/data/products.csv';

/** Last copy of the sheet shipped with the site (keep in step with the Google Sheet). */
const SNAPSHOT: Product[] = productsFromSheet(parseCsv(snapshotCsv));

/**
 * Coffee and other products with their sizes, prices and availability.
 *
 * - With the API (local development with the backend): products managed in /admin/coffee.
 * - Otherwise (the live site): the owner's Google Sheet (environment.productsSheetUrl),
 *   falling back to the bundled snapshot (public/data/products.csv) when the sheet is not
 *   set or can't be read.
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
    if (!environment.productsSheetUrl) return of(SNAPSHOT);
    return this.readCsv(environment.productsSheetUrl).pipe(
      map((products) => {
        if (!products.length) throw new Error('The products sheet has no usable rows');
        return products;
      }),
      catchError(() => of(SNAPSHOT)),
    );
  }

  private readCsv(url: string): Observable<Product[]> {
    return this.http.get(url, { responseType: 'text' }).pipe(map((text) => productsFromSheet(parseCsv(text))));
  }
}
