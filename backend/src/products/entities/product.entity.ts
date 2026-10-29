import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LocalizedText } from '../../common/dto/localized-text.dto';
import { PRODUCT_STATUSES, ProductStatus } from '../products.constants';
import { ProductImage } from './product-image.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 80, unique: true })
  slug: string;

  @Column({ type: 'jsonb' })
  name: LocalizedText;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  description: Partial<LocalizedText>;

  @Column({ type: 'varchar', length: 160, nullable: true })
  origin: string | null;

  @Column({ type: 'varchar', length: 160, nullable: true })
  process: string | null;

  @Column({ name: 'roast_level', type: 'varchar', length: 80, nullable: true })
  roastLevel: string | null;

  /** Growing altitude as printed on the label, e.g. "1,200 - 1,400 MASL". */
  @Column({ type: 'varchar', length: 80, nullable: true })
  altitude: string | null;

  /** Body as printed on the label, e.g. "Full body". */
  @Column({ type: 'varchar', length: 80, nullable: true })
  body: string | null;

  @Column({
    name: 'tasting_notes',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  tastingNotes: string | null;

  @Column({
    type: 'enum',
    enum: PRODUCT_STATUSES,
    enumName: 'product_status',
    default: 'ACTIVE',
  })
  status: ProductStatus;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
