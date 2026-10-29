import { LocalizedText } from './localized-text.model';

export interface ProductImage {
  id?: number;
  imageUrl: string;
  altText: string;
  sortOrder: number;
}

/** One purchasable size, e.g. 100g. `soldOut` is true whenever stock is 0. */
export interface ProductVariant {
  id: number;
  label: string;
  price: number;
  currency: string;
  stock: number;
  soldOut: boolean;
}

export interface Product {
  id: number;
  slug: string;
  name: LocalizedText;
  description: Partial<LocalizedText>;
  origin: string | null;
  process: string | null;
  roastLevel: string | null;
  /** Label fields: growing altitude and body, as printed on the bag. */
  altitude: string | null;
  body: string | null;
  tastingNotes: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export type ProductStatus = 'ACTIVE' | 'HIDDEN';
export type VariantStatus = 'ACTIVE' | 'INACTIVE';

/** Admin API shapes. */
export interface AdminProductVariant extends Omit<ProductVariant, 'soldOut'> {
  sku: string | null;
  status: VariantStatus;
  sortOrder: number;
}

export interface AdminProduct extends Omit<Product, 'variants'> {
  status: ProductStatus;
  sortOrder: number;
  variants: AdminProductVariant[];
  updatedAt: string;
}

export interface ProductVariantInput {
  id?: number;
  label: string;
  sku: string | null;
  price: number;
  currency: string;
  stock: number;
  status: VariantStatus;
  sortOrder: number;
}

export interface ProductInput {
  slug: string;
  name: LocalizedText;
  description: Partial<LocalizedText>;
  origin: string | null;
  process: string | null;
  roastLevel: string | null;
  altitude: string | null;
  body: string | null;
  tastingNotes: string | null;
  status: ProductStatus;
  sortOrder: number;
  images: ProductImage[];
  variants: ProductVariantInput[];
}
