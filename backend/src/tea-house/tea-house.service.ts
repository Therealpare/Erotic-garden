import { Injectable } from '@nestjs/common';
import { TeaCategory, TeaMenuItem } from './entities/tea-menu.entity';

/**
 * Real tea house menu (spec §25/§48). Tea and coffee are included in admission — no
 * fixed price to fabricate. Dessert has no fixed lineup (it changes day to day) so it
 * carries no items here. "Special" has no real content yet, so it stays empty until
 * the owner provides one.
 */
const CATEGORIES: TeaCategory[] = [
  { id: 1, name: 'Tea' },
  { id: 2, name: 'Coffee' },
  { id: 3, name: 'Dessert' },
  { id: 4, name: 'Special' },
];

function makeItem(
  id: number,
  slug: string,
  category: TeaCategoryName,
  name: string,
  sortOrder: number,
): TeaMenuItem {
  return {
    id,
    slug,
    category,
    name,
    description: '',
    price: 'Free',
    imageUrl: `https://picsum.photos/seed/eg-menu-${slug}/600/600`,
    available: true,
    sortOrder,
  };
}

const MENU: TeaMenuItem[] = [
  makeItem(1, 'hot-tea', 'Tea', 'Hot Tea', 0),
  makeItem(2, 'green-tea', 'Tea', 'Green Tea', 1),
  makeItem(3, 'iced-tea', 'Tea', 'Iced Tea', 2),
  makeItem(4, 'lemon-tea', 'Tea', 'Lemon Tea', 3),
  makeItem(5, 'black-tea', 'Tea', 'Black Tea', 4),
  makeItem(6, 'americano', 'Coffee', 'Americano', 0),
  makeItem(7, 'espresso', 'Coffee', 'Espresso', 1),
  makeItem(8, 'latte', 'Coffee', 'Latte', 2),
  makeItem(9, 'cappuccino', 'Coffee', 'Cappuccino', 3),
  makeItem(10, 'mocha', 'Coffee', 'Mocha', 4),
  makeItem(11, 'macchiato', 'Coffee', 'Macchiato', 5),
];

type TeaCategoryName = TeaCategory['name'];

@Injectable()
export class TeaHouseService {
  findCategories(): TeaCategory[] {
    return CATEGORIES;
  }

  findMenu(): TeaMenuItem[] {
    return MENU;
  }
}
