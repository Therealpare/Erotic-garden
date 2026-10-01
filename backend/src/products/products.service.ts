import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';

/**
 * Orderable products. Only one real SKU exists today (owner-confirmed
 * price); the array shape is deliberate so more products/sizes can be
 * added later without changing the orders code that consumes this list.
 */
const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: 'coffee-beans-100g',
    name: 'Coffee Beans',
    size: '100g',
    price: 350,
    currency: 'THB',
    imageUrl: 'images/garden/cof2.webp',
    available: true,
  },
];

@Injectable()
export class ProductsService {
  findAll(): Product[] {
    return PRODUCTS;
  }

  findById(id: number): Product | undefined {
    return PRODUCTS.find((product) => product.id === id);
  }
}
