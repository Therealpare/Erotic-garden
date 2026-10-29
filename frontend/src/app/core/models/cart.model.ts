import { LocalizedText } from './localized-text.model';

export interface CartItem {
  /** The size being bought. */
  variantId: number;
  productId: number;
  slug: string;
  name: LocalizedText;
  size: string;
  price: number;
  currency: string;
  imageUrl: string;
  quantity: number;
  /** Stock known when added/refreshed; the server re-checks before creating the order. */
  maxQuantity: number;
}
