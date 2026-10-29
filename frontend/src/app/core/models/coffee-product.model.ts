import { LocalizedText } from './localized-text.model';

export interface CoffeeProduct {
  id: number;
  name: string;
  localizedName?: LocalizedText;
  weight: string;
  origin: string;
  process: string;
  roastLevel: string;
  tastingNotes: string;
  price: string;
  imageUrl: string;
  altText: string;
}
