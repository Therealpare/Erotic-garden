import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { API_BASE_URL, isApiConfigured } from '../config/api.config';
import { OrderConfirmation, OrderRequest } from '../models/order.model';

/**
 * POST /api/v1/orders. The server prices every line from the database and takes the
 * stock in one transaction; a 409 response lists sizes that ran out in the meantime.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);

  readonly isAvailable = isApiConfigured;

  submit(payload: OrderRequest): Observable<OrderConfirmation> {
    if (!isApiConfigured()) return throwError(() => new Error('API not configured'));
    return this.http.post<OrderConfirmation>(`${API_BASE_URL}/orders`, payload);
  }
}
