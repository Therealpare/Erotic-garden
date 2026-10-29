import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ImageRevealComponent } from '../../shared/components/image-reveal/image-reveal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LocalizedPipe } from '../../shared/pipes/localized.pipe';
import { CoffeeService } from '../../core/services/coffee.service';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { LanguageService } from '../../core/i18n/language.service';
import { getDictionary } from '../../core/i18n/dictionaries';
import { Product, ProductVariant } from '../../core/models/product.model';
import { loadState } from '../../shared/utils/load-state.util';

/** A message shown under one product after pressing "Add to Cart". */
interface ShopNotice {
  productId: number;
  kind: 'added' | 'max';
}

@Component({
  selector: 'app-coffee',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ContainerComponent,
    SectionHeaderComponent,
    ButtonComponent,
    ImageRevealComponent,
    EmptyStateComponent,
    TranslatePipe,
    LocalizedPipe,
  ],
  templateUrl: './coffee.component.html',
  styleUrl: './coffee.component.css',
})
export class CoffeeComponent {
  private readonly coffeeService = inject(CoffeeService);
  private readonly productService = inject(ProductService);
  private readonly languageService = inject(LanguageService);
  readonly cartService = inject(CartService);

  readonly collection = loadState(this.coffeeService.getAll(), []);
  readonly products = computed(() => this.collection().data);

  readonly hasTasteProfile = computed(() =>
    this.products().some((p) => p.origin || p.process || p.roastLevel || p.tastingNotes),
  );

  readonly shop = loadState(this.productService.getAll(), []);
  /** Products that have at least one size on sale. */
  readonly shopProducts = computed(() => this.shop().data.filter((product) => product.variants.length > 0));
  readonly orderingAvailable = this.productService.isLive();

  /** Selected size per product (defaults to the first size that is in stock). */
  private readonly selectedSizes = signal<Record<number, number>>({});
  readonly notice = signal<ShopNotice | null>(null);

  readonly cartItems = this.cartService.items;
  readonly cartTotalAmount = this.cartService.totalAmount;

  selectedVariant(product: Product): ProductVariant {
    const chosen = this.selectedSizes()[product.id];
    return (
      product.variants.find((variant) => variant.id === chosen) ??
      product.variants.find((variant) => !variant.soldOut) ??
      product.variants[0]
    );
  }

  selectSize(product: Product, variant: ProductVariant): void {
    this.selectedSizes.update((sizes) => ({ ...sizes, [product.id]: variant.id }));
    this.notice.set(null);
  }

  /** In-stock and not already fully in the cart. */
  canAdd(variant: ProductVariant): boolean {
    return this.orderingAvailable && !variant.soldOut && this.cartService.quantityOf(variant.id) < variant.stock;
  }

  addToCart(product: Product): void {
    const variant = this.selectedVariant(product);
    const added = this.cartService.addItem(product, variant, 1);
    this.notice.set({ productId: product.id, kind: added ? 'added' : 'max' });
  }

  onlyLeftLabel(stock: number): string {
    return getDictionary(this.languageService.lang()).coffee.shop.onlyLeft.replace('{n}', String(stock));
  }

  updateQuantity(variantId: number, quantity: number): void {
    this.cartService.updateQuantity(variantId, quantity);
  }

  removeItem(variantId: number): void {
    this.cartService.removeItem(variantId);
  }

  formatPrice(price: number, currency: string): string {
    return currency === 'THB' ? `฿${price}` : `${currency} ${price}`;
  }
}
