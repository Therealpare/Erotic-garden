import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'image_url', length: 500 })
  imageUrl: string;

  @Column({ name: 'alt_text', length: 300 })
  altText: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
