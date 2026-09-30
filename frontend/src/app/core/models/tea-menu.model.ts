export type TeaCategoryName = 'Tea' | 'Coffee' | 'Dessert' | 'Special';

export interface TeaCategory {
  id: number;
  name: TeaCategoryName;
}

export interface TeaMenuItem {
  id: number;
  slug: string;
  category: TeaCategoryName;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  available: boolean;
  sortOrder: number;
}
