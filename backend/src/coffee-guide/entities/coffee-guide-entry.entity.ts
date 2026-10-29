import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { LocalizedText } from '../../common/dto/localized-text.dto';
import {
  COFFEE_GUIDE_KINDS,
  COFFEE_GUIDE_STATUSES,
  CoffeeGuideKind,
  CoffeeGuideStatus,
} from '../coffee-guide.constants';

/**
 * One explainer card on the Coffee page: a roast level or a processing method, in EN/TH/DE.
 * These describe roasts and processes in general — the roast and process of each actual
 * coffee live on the product (as printed on its label).
 */
@Entity('coffee_guide_entries')
@Unique(['kind', 'key'])
export class CoffeeGuideEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: COFFEE_GUIDE_KINDS,
    enumName: 'coffee_guide_kind',
  })
  kind: CoffeeGuideKind;

  /** Stable id used by the site to match a product's roast/process, e.g. "light", "washed". */
  @Column({ length: 40 })
  key: string;

  @Column({ type: 'jsonb' })
  name: LocalizedText;

  /** Roast: what the beans look like · Process: how it is done. */
  @Column({ type: 'jsonb', default: () => "'{}'" })
  summary: Partial<LocalizedText>;

  /** Typical flavour in the cup. */
  @Column({ type: 'jsonb', default: () => "'{}'" })
  flavor: Partial<LocalizedText>;

  /** Roast only: brewing methods it suits. */
  @Column({ type: 'jsonb', default: () => "'{}'" })
  brewing: Partial<LocalizedText>;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'image_alt', type: 'varchar', length: 300, nullable: true })
  imageAlt: string | null;

  @Column({
    type: 'enum',
    enum: COFFEE_GUIDE_STATUSES,
    enumName: 'coffee_guide_status',
    default: 'ACTIVE',
  })
  status: CoffeeGuideStatus;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
