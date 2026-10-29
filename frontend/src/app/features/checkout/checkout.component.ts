import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { OrderConfirmation, StockProblem } from '../../core/models/order.model';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LocalizedPipe } from '../../shared/pipes/localized.pipe';

type SubmitState = 'idle' | 'loading' | 'success' | 'error' | 'stock-changed';

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
  private readonly orderService = inject(OrderService);

  readonly items = this.cartService.items;
  readonly totalQuantity = this.cartService.totalQuantity;
  readonly totalAmount = this.cartService.totalAmount;

  readonly orderingAvailable = this.orderService.isAvailable();
  readonly state = signal<SubmitState>('idle');
  readonly confirmation = signal<OrderConfirmation | undefined>(undefined);

  readonly currency = computed(() => this.items()[0]?.currency ?? 'THB');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    contactChannel: ['', [Validators.required, Validators.minLength(2)]],
  });

  submit(): void {
    if (!this.orderingAvailable || this.form.invalid || this.items().length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    this.state.set('loading');
    this.orderService
      .submit({
        name: values.name.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        contactChannel: values.contactChannel.trim(),
        // Only ids and quantities are sent: the server prices each line from the database.
        items: this.items().map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
      })
      .subscribe({
        next: (confirmation) => {
          this.confirmation.set(confirmation);
          this.state.set('success');
          this.cartService.clear();
          this.form.reset();
        },
        error: (error: unknown) => {
          const problems = error instanceof HttpErrorResponse && error.status === 409 ? (error.error?.items as StockProblem[] | undefined) : undefined;
          if (problems?.length) {
            this.cartService.applyStockProblems(problems);
            this.state.set('stock-changed');
          } else {
            this.state.set('error');
          }
        },
      });
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
}
