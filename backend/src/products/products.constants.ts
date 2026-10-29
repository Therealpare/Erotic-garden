export type ProductStatus = 'ACTIVE' | 'HIDDEN';
export const PRODUCT_STATUSES: ProductStatus[] = ['ACTIVE', 'HIDDEN'];

/** INACTIVE sizes are hidden from the shop; ACTIVE sizes with stock 0 show as SOLD OUT. */
export type VariantStatus = 'ACTIVE' | 'INACTIVE';
export const VARIANT_STATUSES: VariantStatus[] = ['ACTIVE', 'INACTIVE'];
