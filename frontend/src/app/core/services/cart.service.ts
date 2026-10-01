import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

const STORAGE_KEY = 'eg-cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(this.readInitial());

  readonly totalQuantity = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly totalAmount = computed(() => this.items().reduce((sum, item) => sum + item.price * item.quantity, 0));

  addItem(product: Product, quantity = 1): void {
    const items = this.items();
    const existing = items.find((item) => item.productId === product.id);
    const next = existing
      ? items.map((item) => (item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item))
      : [
          ...items,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            size: product.size,
            price: product.price,
            currency: product.currency,
            imageUrl: product.imageUrl,
            quantity,
          },
        ];
    this.set(next);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(productId);
      return;
    }
    this.set(this.items().map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  }

  removeItem(productId: number): void {
    this.set(this.items().filter((item) => item.productId !== productId));
  }

  clear(): void {
    this.set([]);
  }

  private set(items: CartItem[]): void {
    this.items.set(items);
    this.persist(items);
  }

  private readInitial(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persist(items: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable — cart just won't persist across visits.
    }
  }
}
