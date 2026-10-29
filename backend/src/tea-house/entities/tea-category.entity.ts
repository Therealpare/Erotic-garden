import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TeaMenuItem } from './tea-menu-item.entity';

/** Menu sections (Tea, Coffee, Drinks, Dessert, Special); the public site translates them by `key`. */
@Entity('tea_categories')
export class TeaCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40, unique: true })
  key: string;

  @Column({ length: 120 })
  name: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @OneToMany(() => TeaMenuItem, (item) => item.category)
  items: TeaMenuItem[];
}
