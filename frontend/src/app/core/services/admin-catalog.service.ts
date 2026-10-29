import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { AdminGalleryImage, GalleryCategory, GalleryImageInput } from '../models/gallery.model';
import { ApiTeaCategory, ApiTeaMenuItem, TeaMenuItemInput } from '../models/tea-menu.model';
import { AdminProduct, AdminProductVariant, ProductInput } from '../models/product.model';
import { AdminCoffeeGuideEntry, CoffeeGuideEntryInput } from '../models/coffee-guide.model';

/** Admin API for images, gallery, tea house menu, coffee products and the coffee guide (auth added by the interceptor). */
@Injectable({ providedIn: 'root' })
export class AdminCatalogService {
  private readonly http = inject(HttpClient);
  private readonly api = `${API_BASE_URL}/admin`;

  uploadImage(file: File): Observable<{ url: string; driver: 'local' | 'cloudinary' }> {
    const body = new FormData();
    body.append('file', file);
    return this.http.post<{ url: string; driver: 'local' | 'cloudinary' }>(`${this.api}/uploads/image`, body);
  }

  // Gallery
  galleryCategories(): Observable<GalleryCategory[]> {
    return this.http.get<GalleryCategory[]>(`${this.api}/gallery/categories`);
  }
  galleryImages(): Observable<AdminGalleryImage[]> {
    return this.http.get<AdminGalleryImage[]>(`${this.api}/gallery`);
  }
  galleryImage(id: number): Observable<AdminGalleryImage> {
    return this.http.get<AdminGalleryImage>(`${this.api}/gallery/${id}`);
  }
  createGalleryImage(input: GalleryImageInput): Observable<AdminGalleryImage> {
    return this.http.post<AdminGalleryImage>(`${this.api}/gallery`, input);
  }
  updateGalleryImage(id: number, input: Partial<GalleryImageInput>): Observable<AdminGalleryImage> {
    return this.http.patch<AdminGalleryImage>(`${this.api}/gallery/${id}`, input);
  }
  deleteGalleryImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/gallery/${id}`);
  }

  // Tea house
  teaCategories(): Observable<ApiTeaCategory[]> {
    return this.http.get<ApiTeaCategory[]>(`${this.api}/tea/categories`);
  }
  teaItems(): Observable<ApiTeaMenuItem[]> {
    return this.http.get<ApiTeaMenuItem[]>(`${this.api}/tea/items`);
  }
  teaItem(id: number): Observable<ApiTeaMenuItem> {
    return this.http.get<ApiTeaMenuItem>(`${this.api}/tea/items/${id}`);
  }
  createTeaItem(input: TeaMenuItemInput): Observable<ApiTeaMenuItem> {
    return this.http.post<ApiTeaMenuItem>(`${this.api}/tea/items`, input);
  }
  updateTeaItem(id: number, input: Partial<TeaMenuItemInput>): Observable<ApiTeaMenuItem> {
    return this.http.patch<ApiTeaMenuItem>(`${this.api}/tea/items/${id}`, input);
  }
  deleteTeaItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/tea/items/${id}`);
  }

  // Coffee products
  products(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>(`${this.api}/products`);
  }
  product(id: number): Observable<AdminProduct> {
    return this.http.get<AdminProduct>(`${this.api}/products/${id}`);
  }
  createProduct(input: ProductInput): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(`${this.api}/products`, input);
  }
  updateProduct(id: number, input: Partial<ProductInput>): Observable<AdminProduct> {
    return this.http.patch<AdminProduct>(`${this.api}/products/${id}`, input);
  }
  updateStock(variantId: number, stock: number): Observable<AdminProductVariant> {
    return this.http.patch<AdminProductVariant>(`${this.api}/products/variants/${variantId}/stock`, { stock });
  }
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/products/${id}`);
  }

  // Coffee guide (roast levels and processing methods)
  coffeeGuideEntries(): Observable<AdminCoffeeGuideEntry[]> {
    return this.http.get<AdminCoffeeGuideEntry[]>(`${this.api}/coffee-guide`);
  }
  coffeeGuideEntry(id: number): Observable<AdminCoffeeGuideEntry> {
    return this.http.get<AdminCoffeeGuideEntry>(`${this.api}/coffee-guide/${id}`);
  }
  updateCoffeeGuideEntry(id: number, input: CoffeeGuideEntryInput): Observable<AdminCoffeeGuideEntry> {
    return this.http.patch<AdminCoffeeGuideEntry>(`${this.api}/coffee-guide/${id}`, input);
  }
}
