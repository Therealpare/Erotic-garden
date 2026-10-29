import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { API_BASE_URL, isApiConfigured } from '../config/api.config';
import { ApiTeaCategory, ApiTeaMenuItem, TeaCategory, TeaMenuItem } from '../models/tea-menu.model';
import { resolveImageUrl } from '../../shared/utils/image-url.util';

/**
 * Tea house menu, managed in /admin/tea and stored in the database. Tea and coffee are
 * included in admission (no fabricated prices, spec §25/§48). The constants below are the
 * offline fallback used only while a build has no API configured, mirroring what the site
 * showed before the menu moved to the database.
 */
const FALLBACK_CATEGORIES: TeaCategory[] = [
  { id: 1, name: 'Tea' },
  { id: 2, name: 'Coffee' },
  { id: 3, name: 'Dessert' },
  { id: 4, name: 'Special' },
];

const FALLBACK_ITEMS: [string, TeaMenuItem['category'], TeaMenuItem['name']][] = [
  ['hot-tea', 'Tea', { en: 'Hot Tea', th: 'ชาร้อน', de: 'Heißer Tee' }],
  ['green-tea', 'Tea', { en: 'Green Tea', th: 'ชาเขียว', de: 'Grüner Tee' }],
  ['iced-tea', 'Tea', { en: 'Iced Tea', th: 'ชาเย็น', de: 'Eistee' }],
  ['lemon-tea', 'Tea', { en: 'Lemon Tea', th: 'ชามะนาว', de: 'Zitronentee' }],
  ['black-tea', 'Tea', { en: 'Black Tea', th: 'ชาดำ', de: 'Schwarzer Tee' }],
  ['americano', 'Coffee', { en: 'Americano', th: 'อเมริกาโน่' }],
  ['espresso', 'Coffee', { en: 'Espresso', th: 'เอสเปรสโซ' }],
  ['latte', 'Coffee', { en: 'Latte', th: 'ลาเต้' }],
  ['cappuccino', 'Coffee', { en: 'Cappuccino', th: 'คาปูชิโน่' }],
  ['mocha', 'Coffee', { en: 'Mocha', th: 'มอคค่า' }],
  ['macchiato', 'Coffee', { en: 'Macchiato', th: 'มัคคิอาโต้' }],
];

const FALLBACK_MENU: TeaMenuItem[] = FALLBACK_ITEMS.map(([slug, category, name], index) => ({
  id: index + 1,
  slug,
  category,
  name,
  description: {},
  price: null,
  includedInAdmission: true,
  imageUrl: null,
  status: 'AVAILABLE',
  sortOrder: index,
}));

@Injectable({ providedIn: 'root' })
export class TeaHouseService {
  private readonly http = inject(HttpClient);

  getCategories(): Observable<TeaCategory[]> {
    if (!isApiConfigured()) return of(FALLBACK_CATEGORIES);
    return this.http
      .get<ApiTeaCategory[]>(`${API_BASE_URL}/tea/categories`)
      .pipe(map((categories) => categories.map((category) => ({ id: category.id, name: category.key }))));
  }

  getMenu(): Observable<TeaMenuItem[]> {
    if (!isApiConfigured()) return of(FALLBACK_MENU);
    return this.http.get<ApiTeaMenuItem[]>(`${API_BASE_URL}/tea/menu`).pipe(
      map((items) =>
        items.map((item) => ({
          id: item.id,
          slug: item.slug,
          category: item.category.key,
          name: item.name,
          description: item.description,
          price: item.price,
          includedInAdmission: item.includedInAdmission,
          imageUrl: item.imageUrl ? resolveImageUrl(item.imageUrl) : null,
          status: item.status,
          sortOrder: item.sortOrder,
        })),
      ),
    );
  }
}
