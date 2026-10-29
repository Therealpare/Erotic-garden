import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product, ProductVariant } from '../models/product.model';

const variant = (id: number, stock: number, label = `${id}g`): ProductVariant => ({
  id,
  label,
  price: 100 * id,
  currency: 'THB',
  stock,
  soldOut: stock === 0,
});

const product = (variants: ProductVariant[]): Product => ({
  id: 1,
  slug: 'beans',
  name: { en: 'Beans', th: 'เมล็ด' },
  description: {},
  origin: null,
  process: null,
  roastLevel: null,
  altitude: null,
  body: null,
  tastingNotes: null,
  images: [{ imageUrl: 'images/garden/cof2.webp', altText: 'bag', sortOrder: 0 }],
  variants,
});

describe('CartService', () => {
  let cart: CartService;

  beforeEach(() => {
    localStorage.removeItem('eg-cart');
    TestBed.configureTestingModule({});
    cart = TestBed.inject(CartService);
  });

  it('adds each size as its own line with that size\'s price', () => {
    const small = variant(1, 5);
    const large = variant(2, 5);
    const p = product([small, large]);
    cart.addItem(p, small);
    cart.addItem(p, large);
    cart.addItem(p, small);
    expect(cart.items().map((item) => [item.size, item.quantity, item.price])).toEqual([
      ['1g', 2, 100],
      ['2g', 1, 200],
    ]);
    expect(cart.totalAmount()).toBe(400);
  });

  it('refuses sold-out sizes', () => {
    const soldOut = variant(1, 0);
    expect(cart.addItem(product([soldOut]), soldOut)).toBeFalse();
    expect(cart.items().length).toBe(0);
  });

  it('never lets the quantity exceed the known stock', () => {
    const v = variant(1, 2);
    const p = product([v]);
    expect(cart.addItem(p, v)).toBeTrue();
    expect(cart.addItem(p, v)).toBeTrue();
    expect(cart.addItem(p, v)).toBeFalse();
    cart.updateQuantity(1, 10);
    expect(cart.quantityOf(1)).toBe(2);
  });

  it('applies the server stock report: lowers quantities and drops sold-out lines', () => {
    const a = variant(1, 5);
    const b = variant(2, 5);
    const p = product([a, b]);
    cart.addItem(p, a, 3);
    cart.addItem(p, b, 2);
    cart.applyStockProblems([
      { variantId: 1, available: 1 },
      { variantId: 2, available: 0 },
    ]);
    expect(cart.items().map((item) => [item.variantId, item.quantity, item.maxQuantity])).toEqual([[1, 1, 1]]);
  });

  it('discards carts saved by the old (pre-size) cart format', () => {
    localStorage.setItem('eg-cart', JSON.stringify([{ productId: 1, slug: 'coffee-beans-100g', name: 'Coffee Beans', quantity: 1 }]));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    expect(TestBed.inject(CartService).items()).toEqual([]);
  });
});
