import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ImageRevealComponent } from '../../shared/components/image-reveal/image-reveal.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { CoffeeService } from '../../core/services/coffee.service';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { LanguageService } from '../../core/i18n/language.service';
import { getDictionary } from '../../core/i18n/dictionaries';

@Component({
  selector: 'app-coffee',
  standalone: true,
  imports: [CommonModule, RouterLink, ContainerComponent, SectionHeaderComponent, ButtonComponent, ImageRevealComponent, TranslatePipe],
  templateUrl: './coffee.component.html',
  styleUrl: './coffee.component.css',
})
export class CoffeeComponent {
  private readonly coffeeService = inject(CoffeeService);
  private readonly productService = inject(ProductService);
  private readonly languageService = inject(LanguageService);
  readonly cartService = inject(CartService);

  readonly products = toSignal(this.coffeeService.getAll(), { initialValue: [] });

  readonly hasTasteProfile = computed(() =>
    this.products().some((p) => p.origin || p.process || p.roastLevel || p.tastingNotes),
  );

  private readonly rawShopProducts = toSignal(this.productService.getAll(), { initialValue: [] });

  readonly shopProducts = computed(() => {
    const items = getDictionary(this.languageService.lang()).coffee.shopProducts as Record<string, { name: string }>;
    return this.rawShopProducts().map((product) => {
      const translated = items[product.slug];
      return translated ? { ...product, name: translated.name } : product;
    });
  });

  readonly cartItems = this.cartService.items;
  readonly cartTotalAmount = this.cartService.totalAmount;

  addToCart(product: ReturnType<typeof this.shopProducts>[number]): void {
    this.cartService.addItem(product, 1);
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  formatPrice(price: number, currency: string): string {
    return currency === 'THB' ? `฿${price}` : `${currency} ${price}`;
  }
}
