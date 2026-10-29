export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface OrderItemRequest {
  variantId: number;
  quantity: number;
}

export interface OrderRequest {
  name: string;
  phone: string;
  address: string;
  contactChannel: string;
  items: OrderItemRequest[];
}

export interface OrderConfirmation {
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
}

/** 409 body when stock ran out between adding to cart and placing the order. */
export interface StockProblem {
  variantId: number;
  available: number;
}
