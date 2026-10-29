import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { DecimalTransformer } from '../../database/decimal.transformer';
import { VARIANT_STATUSES, VariantStatus } from '../products.constants';
import { Product } from './product.entity';

/** One purchasable size of a product (e.g. 100g) with its own price and stock. */
@Entity('product_variants')
@Unique('UQ_product_variants_product_label', ['productId', 'label'])
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  /** Size label shown to customers, e.g. "100g". */
  @Column({ length: 40 })
  label: string;

  @Column({ type: 'varchar', length: 60, unique: true, nullable: true })
  sku: string | null;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  price: number;

  @Column({ length: 3, default: 'THB' })
  currency: string;

  /** Units on hand. A database CHECK keeps it from ever going below zero. */
  @Column({ default: 0 })
  stock: number;

  @Column({
    type: 'enum',
    enum: VARIANT_STATUSES,
    enumName: 'variant_status',
    default: 'ACTIVE',
  })
  status: VariantStatus;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
