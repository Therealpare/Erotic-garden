import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product, ProductVariant } from '../models/product.model';
import { StockProblem } from '../models/order.model';

const STORAGE_KEY = 'eg-cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(this.readInitial());

  readonly totalQuantity = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly totalAmount = computed(() => this.items().reduce((sum, item) => sum + item.price * item.quantity, 0));

  quantityOf(variantId: number): number {
    return this.items().find((item) => item.variantId === variantId)?.quantity ?? 0;
  }

  /** Adds one size of a product. Never exceeds the stock known for that size; returns false if nothing was added. */
  addItem(product: Product, variant: ProductVariant, quantity = 1): boolean {
    if (variant.soldOut || variant.stock <= 0) return false;
    const items = this.items();
    const existing = items.find((item) => item.variantId === variant.id);
    const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, variant.stock);
    if (existing && nextQuantity === existing.quantity) return false;

    const line: CartItem = {
      variantId: variant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      size: variant.label,
      price: variant.price,
      currency: variant.currency,
      imageUrl: product.images[0]?.imageUrl ?? '',
      quantity: nextQuantity,
      maxQuantity: variant.stock,
    };
    this.set(existing ? items.map((item) => (item.variantId === variant.id ? line : item)) : [...items, line]);
    return true;
  }

  updateQuantity(variantId: number, quantity: number): void {
    if (quantity < 1) {
      this.removeItem(variantId);
      return;
    }
    this.set(
      this.items().map((item) =>
        item.variantId === variantId ? { ...item, quantity: Math.min(quantity, item.maxQuantity) } : item,
      ),
    );
  }

  removeItem(variantId: number): void {
    this.set(this.items().filter((item) => item.variantId !== variantId));
  }

  /** Applies the server's stock report after a 409: lowers quantities, drops sold-out lines. */
  applyStockProblems(problems: StockProblem[]): void {
    const available = new Map(problems.map((problem) => [problem.variantId, problem.available]));
    this.set(
      this.items()
        .map((item) =>
          available.has(item.variantId)
            ? { ...item, maxQuantity: available.get(item.variantId)!, quantity: Math.min(item.quantity, available.get(item.variantId)!) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  clear(): void {
    this.set([]);
  }

  private set(items: CartItem[]): void {
    this.items.set(items);
    this.persist(items);
  }

  /** Drops lines saved by older versions of the cart (before sizes/variants existed). */
  private readInitial(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed)
        ? parsed.filter(
            (item): item is CartItem =>
              typeof item?.variantId === 'number' && typeof item?.name === 'object' && typeof item?.maxQuantity === 'number',
          )
        : [];
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
