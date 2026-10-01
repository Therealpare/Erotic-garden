import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { OrderConfirmation } from '../../core/models/order.model';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ContainerComponent, ButtonComponent, TranslatePipe],
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
    if (this.form.invalid || this.items().length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    this.state.set('loading');
    this.orderService
      .submit({
        name: values.name,
        phone: values.phone,
        address: values.address,
        contactChannel: values.contactChannel,
        items: this.items().map((item) => ({
          productId: item.productId,
          name: item.name,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: this.totalAmount(),
        currency: this.currency(),
      })
      .subscribe({
        next: (confirmation) => {
          this.confirmation.set(confirmation);
          this.state.set('success');
          this.cartService.clear();
          this.form.reset();
        },
        error: () => this.state.set('error'),
      });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId);
  }

  fieldInvalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }
}
