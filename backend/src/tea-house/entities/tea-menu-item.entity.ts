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
import { LocalizedText } from '../../common/dto/localized-text.dto';
import { DecimalTransformer } from '../../database/decimal.transformer';
import { MENU_ITEM_STATUSES, MenuItemStatus } from '../tea-house.constants';
import { TeaCategory } from './tea-category.entity';

@Entity('tea_menu_items')
@Index(['categoryId', 'sortOrder'])
export class TeaMenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => TeaCategory, (category) => category.items, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: TeaCategory;

  @Column({ length: 80, unique: true })
  slug: string;

  @Column({ type: 'jsonb' })
  name: LocalizedText;

  @Column({ type: 'jsonb', default: () => "'{}'" })
  description: Partial<LocalizedText>;

  /** Null when no price is shown (e.g. included in admission, or not yet confirmed). */
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: DecimalTransformer,
  })
  price: number | null;

  @Column({ name: 'included_in_admission', default: false })
  includedInAdmission: boolean;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({
    type: 'enum',
    enum: MENU_ITEM_STATUSES,
    enumName: 'menu_item_status',
    default: 'AVAILABLE',
  })
  status: MenuItemStatus;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
