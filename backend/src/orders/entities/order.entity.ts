export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export class OrderItem {
  productId: number;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

/** Mirrors the `bookings` table shape (spec §35), adapted for product orders. No payment gateway yet — every order starts PENDING. */
export class Order {
  id: number;
  orderNumber: string;
  name: string;
  phone: string;
  address: string;
  contactChannel: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
