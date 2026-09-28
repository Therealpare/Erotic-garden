export type TeaCategoryName = 'Tea' | 'Coffee' | 'Dessert' | 'Special';

export class TeaCategory {
  id: number;
  name: TeaCategoryName;
}

export class TeaMenuItem {
  id: number;
  category: TeaCategoryName;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  available: boolean;
  sortOrder: number;
}
