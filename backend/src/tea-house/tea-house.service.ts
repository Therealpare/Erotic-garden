import { Injectable } from '@nestjs/common';
import { TeaCategory, TeaMenuItem } from './entities/tea-menu.entity';

/** Demo tea menu. Prices are placeholders pending owner-verified content (spec §25/§48). */
const CATEGORIES: TeaCategory[] = [
  { id: 1, name: 'Tea' },
  { id: 2, name: 'Coffee' },
  { id: 3, name: 'Dessert' },
  { id: 4, name: 'Special' },
];

const MENU: TeaMenuItem[] = [
  {
    id: 1,
    category: 'Tea',
    name: 'Northern Thai Oolong',
    description: 'Demo content — pending owner-verified menu details.',
    price: 'TODO',
    imageUrl: 'https://picsum.photos/seed/eg-menu-tea-1/600/600',
    available: true,
    sortOrder: 0,
  },
  {
    id: 2,
    category: 'Tea',
    name: 'Jasmine Green Tea',
    description: 'Demo content — pending owner-verified menu details.',
    price: 'TODO',
    imageUrl: 'https://picsum.photos/seed/eg-menu-tea-2/600/600',
    available: true,
    sortOrder: 1,
  },
  {
    id: 3,
    category: 'Coffee',
    name: 'Doi Chang Espresso',
    description: 'Demo content — pending owner-verified menu details.',
    price: 'TODO',
    imageUrl: 'https://picsum.photos/seed/eg-menu-coffee-1/600/600',
    available: true,
    sortOrder: 0,
  },
  {
    id: 4,
    category: 'Coffee',
    name: 'Iced Cold Brew',
    description: 'Demo content — pending owner-verified menu details.',
    price: 'TODO',
    imageUrl: 'https://picsum.photos/seed/eg-menu-coffee-2/600/600',
    available: true,
    sortOrder: 1,
  },
  {
    id: 5,
    category: 'Dessert',
    name: 'Coconut Sticky Rice',
    description: 'Demo content — pending owner-verified menu details.',
    price: 'TODO',
    imageUrl: 'https://picsum.photos/seed/eg-menu-dessert-1/600/600',
    available: true,
    sortOrder: 0,
  },
  {
    id: 6,
    category: 'Dessert',
    name: 'Butterfly Pea Cake',
    description: 'Demo content — pending owner-verified menu details.',
    price: 'TODO',
    imageUrl: 'https://picsum.photos/seed/eg-menu-dessert-2/600/600',
    available: true,
    sortOrder: 1,
  },
  {
    id: 7,
    category: 'Special',
    name: 'Garden Tasting Set',
    description: 'Demo content — pending owner-verified menu details.',
    price: 'TODO',
    imageUrl: 'https://picsum.photos/seed/eg-menu-special-1/600/600',
    available: true,
    sortOrder: 0,
  },
];

@Injectable()
export class TeaHouseService {
  findCategories(): TeaCategory[] {
    return CATEGORIES;
  }

  findMenu(): TeaMenuItem[] {
    return MENU;
  }
}
