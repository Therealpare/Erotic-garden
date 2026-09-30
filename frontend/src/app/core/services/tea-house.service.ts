import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TeaCategory, TeaMenuItem } from '../models/tea-menu.model';

/**
 * Real tea house menu (spec §25/§48). Tea and coffee are included in admission — no
 * fixed price to fabricate. Item names/descriptions are translated via
 * teaHouse.menuItems[slug] in the i18n dictionaries (EN|TH|DE), not stored here;
 * the component merges them in by slug, mirroring ExperienceComponent's pattern.
 * Dessert has no fixed lineup (it changes day to day) so it carries no items here —
 * the page shows an explanatory note instead. "Special" has no real content yet, so
 * it stays empty until the owner provides one.
 */
const DEMO_CATEGORIES: TeaCategory[] = [
  { id: 1, name: 'Tea' },
  { id: 2, name: 'Coffee' },
  { id: 3, name: 'Dessert' },
  { id: 4, name: 'Special' },
];

function makeItem(id: number, slug: string, category: TeaCategory['name'], sortOrder: number): TeaMenuItem {
  return {
    id,
    slug,
    category,
    name: '',
    description: '',
    price: '',
    imageUrl: `https://picsum.photos/seed/eg-menu-${slug}/600/600`,
    available: true,
    sortOrder,
  };
}

const DEMO_MENU: TeaMenuItem[] = [
  makeItem(1, 'hot-tea', 'Tea', 0),
  makeItem(2, 'green-tea', 'Tea', 1),
  makeItem(3, 'iced-tea', 'Tea', 2),
  makeItem(4, 'lemon-tea', 'Tea', 3),
  makeItem(5, 'black-tea', 'Tea', 4),
  makeItem(6, 'americano', 'Coffee', 0),
  makeItem(7, 'espresso', 'Coffee', 1),
  makeItem(8, 'latte', 'Coffee', 2),
  makeItem(9, 'cappuccino', 'Coffee', 3),
  makeItem(10, 'mocha', 'Coffee', 4),
  makeItem(11, 'macchiato', 'Coffee', 5),
];

@Injectable({ providedIn: 'root' })
export class TeaHouseService {
  getCategories(): Observable<TeaCategory[]> {
    return of(DEMO_CATEGORIES);
  }

  getMenu(): Observable<TeaMenuItem[]> {
    return of(DEMO_MENU);
  }
}
