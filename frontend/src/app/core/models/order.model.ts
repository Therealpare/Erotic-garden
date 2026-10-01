export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface OrderItemRequest {
  productId: number;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface OrderRequest {
  name: string;
  phone: string;
  address: string;
  contactChannel: string;
  items: OrderItemRequest[];
  totalAmount: number;
  currency: string;
}

export interface OrderConfirmation {
  orderNumber: string;
  status: OrderStatus;
}
