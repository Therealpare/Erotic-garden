import { LocalizedText } from './localized-text.model';

export type TeaCategoryName = 'Tea' | 'Coffee' | 'Drinks' | 'Dessert' | 'Special';

export interface TeaCategory {
  id: number;
  /** Stable key the site translates (Tea, Coffee, Drinks, Dessert, Special). */
  name: TeaCategoryName;
}

/** AVAILABLE: on the menu · SOLD_OUT: shown as unavailable today · HIDDEN: not shown. */
export type MenuItemStatus = 'AVAILABLE' | 'SOLD_OUT' | 'HIDDEN';
export const MENU_ITEM_STATUSES: MenuItemStatus[] = ['AVAILABLE', 'SOLD_OUT', 'HIDDEN'];

export interface TeaMenuItem {
  id: number;
  slug: string;
  category: TeaCategoryName;
  name: LocalizedText;
  description: Partial<LocalizedText>;
  /** Null when no price is shown. */
  price: number | null;
  includedInAdmission: boolean;
  imageUrl: string | null;
  status: MenuItemStatus;
  sortOrder: number;
}

/** Raw admin API shapes. */
export interface ApiTeaCategory {
  id: number;
  key: TeaCategoryName;
  name: string;
  sortOrder: number;
}

export interface ApiTeaMenuItem extends Omit<TeaMenuItem, 'category'> {
  categoryId: number;
  category: ApiTeaCategory;
}

export interface TeaMenuItemInput {
  categoryId: number;
  slug: string;
  name: LocalizedText;
  description: Partial<LocalizedText>;
  price: number | null;
  includedInAdmission: boolean;
  imageUrl: string | null;
  status: MenuItemStatus;
  sortOrder: number;
}
