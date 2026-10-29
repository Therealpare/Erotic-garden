import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DecimalTransformer } from '../../database/decimal.transformer';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { Order } from './order.entity';

/** A snapshot of what was bought, so later product/price edits never rewrite past orders. */
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'variant_id', type: 'int', nullable: true })
  variantId: number | null;

  @ManyToOne(() => ProductVariant, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant | null;

  @Column({ name: 'product_name', length: 160 })
  productName: string;

  @Column({ name: 'variant_label', length: 40 })
  variantLabel: string;

  @Column({
    name: 'unit_price',
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  unitPrice: number;

  @Column()
  quantity: number;
}
