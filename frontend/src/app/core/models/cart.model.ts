import { LocalizedText } from './localized-text.model';

export interface CartItem {
  /** The size being bought. */
  variantId: number;
  productId: number;
  slug: string;
  name: LocalizedText;
  size: string;
  /** Null when the price is confirmed on LINE. */
  price: number | null;
  currency: string;
  imageUrl: string;
  quantity: number;
  /** Most that can be pre-ordered of this size in one order. */
  maxQuantity: number;
}
