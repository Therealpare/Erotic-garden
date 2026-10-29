import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DecimalTransformer } from '../../database/decimal.transformer';
import { OrderItem } from './order-item.entity';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
];

/** No payment gateway yet — every order starts PENDING and staff follow up by phone/LINE. */
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_number', length: 16, unique: true })
  orderNumber: string;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 40 })
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ name: 'contact_channel', length: 120 })
  contactChannel: string;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: DecimalTransformer,
  })
  totalAmount: number;

  @Column({ length: 3, default: 'THB' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ORDER_STATUSES,
    enumName: 'order_status',
    default: 'PENDING',
  })
  status: OrderStatus;

  @Column({ name: 'line_notified_at', type: 'timestamptz', nullable: true })
  lineNotifiedAt: Date | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: ['insert'] })
  items: OrderItem[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
