import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CartService } from '../../core/services/cart.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageService } from '../../core/i18n/language.service';
import { LocalizedPipe, pickLocalized } from '../../shared/pipes/localized.pipe';
import { lineMessageUrl, openLine } from '../../core/config/line.config';
import { composeLineMessage, formatBaht, formatVisitDate, lineLabels } from '../../shared/utils/line-message.util';

/** Today's date as YYYY-MM-DD in the visitor's own time zone. */
export function todayIso(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

export function notInPast(control: AbstractControl<string>): ValidationErrors | null {
  return control.value && control.value < todayIso() ? { past: true } : null;
}

/**
 * Pre-order for a garden visit. Nothing is stored or charged here: the list is sent to the
 * garden's LINE account as a typed-in message, and staff confirm it in the chat.
 */
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ContainerComponent, ButtonComponent, TranslatePipe, LocalizedPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly languageService = inject(LanguageService);

  readonly items = this.cartService.items;
  readonly totalAmount = this.cartService.totalAmount;
  readonly hasUnpricedItems = this.cartService.hasUnpricedItems;
  readonly hasPricedItems = computed(() => this.items().some((item) => item.price !== null));

  readonly minDate = todayIso();
  /** The LINE link of the last pre-order, for "Open LINE again". */
  readonly sentUrl = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    visitDate: ['', [Validators.required, notInPast]],
    guests: [null as number | null, [Validators.min(1), Validators.max(50)]],
    phone: ['', [Validators.pattern(/^[+\d][\d\s()-]{5,38}$/)]],
    note: ['', [Validators.maxLength(500)]],
  });

  submit(): void {
    if (this.form.invalid || this.items().length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    const url = lineMessageUrl(this.message());
    this.sentUrl.set(url);
    openLine(url);
  }

  /** The guest has sent the message in LINE: start a fresh list. */
  finish(): void {
    this.cartService.clear();
    this.form.reset();
    this.sentUrl.set(null);
  }

  formatPrice(amount: number): string {
    return formatBaht(amount);
  }

  updateQuantity(variantId: number, quantity: number): void {
    this.cartService.updateQuantity(variantId, quantity);
  }

  removeItem(variantId: number): void {
    this.cartService.removeItem(variantId);
  }

  fieldInvalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  private message(): string {
    const lang = this.languageService.lang();
    const t = lineLabels(lang);
    const value = this.form.getRawValue();
    const lines = this.items().map((item) => {
      const price = item.price === null ? t.priceOnLine : formatBaht(item.price * item.quantity);
      return `• ${pickLocalized(item.name, lang)} ${item.size} × ${item.quantity} — ${price}`;
    });
    const total = this.hasPricedItems()
      ? `${t.total}: ${formatBaht(this.totalAmount())}${this.hasUnpricedItems() ? ` ${t.plusOnLine}` : ''}`
      : '';
    return composeLineMessage(
      t.preOrder,
      [
        [t.name, value.name],
        [t.visitDate, formatVisitDate(value.visitDate, lang)],
        [t.guests, value.guests],
        [t.phone, value.phone],
      ],
      [`${t.items}:`, ...lines, total, value.note.trim() ? `${t.note}: ${value.note.trim()}` : ''],
    );
  }
}
