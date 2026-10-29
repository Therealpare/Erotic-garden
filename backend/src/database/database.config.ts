import { DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { MediaItem } from '../media/entities/media-item.entity';
import { EventInquiry } from '../event-inquiries/entities/event-inquiry.entity';
import { GalleryCategory } from '../gallery/entities/gallery-category.entity';
import { GalleryImage } from '../gallery/entities/gallery-image.entity';
import { TeaCategory } from '../tea-house/entities/tea-category.entity';
import { TeaMenuItem } from '../tea-house/entities/tea-menu-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductImage } from '../products/entities/product-image.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';

export const ENTITIES = [
  User,
  MediaItem,
  EventInquiry,
  GalleryCategory,
  GalleryImage,
  TeaCategory,
  TeaMenuItem,
  Product,
  ProductImage,
  ProductVariant,
  Order,
  OrderItem,
];

/**
 * Builds PostgreSQL connection options from environment variables. Shared by the Nest app
 * and the TypeORM CLI (data-source.ts) so migrations always target the same database.
 * DATABASE_URL (as issued by Neon, Supabase, Render, Railway…) takes precedence over DB_*.
 * Schema changes go through migrations only — `synchronize` stays off (spec Phase 5).
 */
export function buildDataSourceOptions(
  env: NodeJS.ProcessEnv,
): DataSourceOptions {
  const ssl = env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;
  const connection = env.DATABASE_URL
    ? { url: env.DATABASE_URL }
    : {
        host: env.DB_HOST ?? 'localhost',
        port: Number(env.DB_PORT ?? 5432),
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
      };

  return {
    type: 'postgres',
    ...connection,
    ssl,
    entities: ENTITIES,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
  };
}
