import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GalleryCategory } from './gallery-category.entity';

@Entity('gallery_images')
@Index(['isPublished', 'sortOrder'])
export class GalleryImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => GalleryCategory, (category) => category.images, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: GalleryCategory;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ name: 'image_url', length: 500 })
  imageUrl: string;

  @Column({ name: 'alt_text', length: 300 })
  altText: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ name: 'is_published', default: true })
  isPublished: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
