import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ImageRevealComponent } from '../../shared/components/image-reveal/image-reveal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LocalizedPipe, pickLocalized } from '../../shared/pipes/localized.pipe';
import { ProductService } from '../../core/services/product.service';
import { CoffeeGuideService } from '../../core/services/coffee-guide.service';
import { CartService } from '../../core/services/cart.service';
import { LanguageService } from '../../core/i18n/language.service';
import { getDictionary } from '../../core/i18n/dictionaries';
import { Product, ProductVariant } from '../../core/models/product.model';
import { CoffeeGuideEntry } from '../../core/models/coffee-guide.model';
import { loadState } from '../../shared/utils/load-state.util';
import { ROAST_STEPS, processKey, roastKeys, roastStep } from '../../shared/utils/coffee-profile.util';

/** A message shown under one product after pressing "Add to Cart". */
interface ShopNotice {
  productId: number;
  kind: 'added' | 'max';
}

/** One coffee in "Our coffees", with its label details linked to the roast/process explainers. */
interface BeanProfile {
  product: Product;
  roastStep: number | null;
  /** Localized roast name for a recognised label value, otherwise the label text itself. */
  roastLabel: string;
  process: CoffeeGuideEntry | null;
}

/** Bean colour for each step of the roast scale, light to dark. */
export const ROAST_COLORS = ['#C49A6C', '#A97447', '#875632', '#653B22', '#3B2418'];
const ROAST_KEY_COLOR: Record<string, string> = { light: ROAST_COLORS[0], medium: ROAST_COLORS[2], dark: ROAST_COLORS[4] };

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
  private readonly productService = inject(ProductService);
  private readonly languageService = inject(LanguageService);
  readonly cartService = inject(CartService);

  readonly roastSteps = Array.from({ length: ROAST_STEPS }, (_, step) => step);
  readonly roastColors = ROAST_COLORS;

  readonly shop = loadState(this.productService.getAll(), []);
  readonly guide = loadState(inject(CoffeeGuideService).get(), { roastLevels: [], processes: [] });

  /** Products that have at least one size on sale. */
  readonly shopProducts = computed(() => this.shop().data.filter((product) => product.variants.length > 0));
  readonly orderingAvailable = this.productService.isLive();

  /** Coffees with label details (roast or process filled in by an admin). */
  readonly beans = computed<BeanProfile[]>(() => {
    const lang = this.languageService.lang();
    const steps = getDictionary(lang).coffee.roast.steps;
    const processes = this.guide().data.processes;
    return this.shop()
      .data.filter((product) => product.roastLevel || product.process)
      .map((product) => {
        const step = roastStep(product.roastLevel);
        return {
          product,
          roastStep: step,
          roastLabel: step !== null ? steps[step] : (product.roastLevel ?? ''),
          process: processes.find((entry) => entry.key === processKey(product.process)) ?? null,
        };
      });
  });

  /** Selected size per product (defaults to the first size that is in stock). */
  private readonly selectedSizes = signal<Record<number, number>>({});
  readonly notice = signal<ShopNotice | null>(null);

  readonly cartItems = this.cartService.items;
  readonly cartTotalAmount = this.cartService.totalAmount;

  /** Our coffees whose label roast falls in this roast level (light-medium counts for both). */
  beansAtRoast(key: string): BeanProfile[] {
    return this.beans().filter((bean) => roastKeys(bean.roastStep).includes(key));
  }

  beansWithProcess(key: string): BeanProfile[] {
    return this.beans().filter((bean) => bean.process?.key === key);
  }

  roastColor(key: string): string {
    return ROAST_KEY_COLOR[key] ?? ROAST_COLORS[2];
  }

  beanNames(beans: BeanProfile[]): string {
    const lang = this.languageService.lang();
    return beans.map((bean) => pickLocalized(bean.product.name, lang)).join(' · ');
  }

  /** In-page jump to an explainer section (a plain #anchor would resolve against <base href> and leave the page). */
  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

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
