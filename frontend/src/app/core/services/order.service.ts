import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { OrderConfirmation, OrderRequest } from '../models/order.model';

/**
 * Mocks POST /api/v1/orders until the real backend is connected (mirrors
 * BookingService). The real backend generates the order number server-side
 * on insert; this mock generates one client-side only so the confirmation
 * UI has something real to show. No payment gateway yet — every order is
 * created with status PENDING.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  submit(payload: OrderRequest): Observable<OrderConfirmation> {
    const code = this.generateOrderCode();
    return of({ orderNumber: code, status: 'PENDING' as const }).pipe(delay(700));
  }

  private generateOrderCode(): string {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `EGC-${random}`;
  }
}
