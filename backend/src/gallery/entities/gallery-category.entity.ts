import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GalleryImage } from './gallery-image.entity';

/** Fixed set of gallery sections; the public site translates them by slug. */
@Entity('gallery_categories')
export class GalleryCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60, unique: true })
  slug: string;

  @Column({ length: 120 })
  name: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @OneToMany(() => GalleryImage, (image) => image.category)
  images: GalleryImage[];
}
