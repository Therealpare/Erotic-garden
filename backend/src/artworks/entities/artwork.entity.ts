export type ArtworkCategory = 'SCULPTURE' | 'GARDEN';
export type ArtworkStatus = 'PUBLISHED' | 'DRAFT';

export class ArtworkImage {
  id: number;
  artworkId: number;
  imageUrl: string;
  publicId: string;
  altText: string;
  sortOrder: number;
}

/**
 * Mirrors spec §35 `artworks` table, plus `category` — required by the §13 filter UI
 * (ALL/SCULPTURE/GARDEN/FEATURED) but not present in the spec's literal schema.
 */
export class Artwork {
  id: number;
  title: string;
  slug: string;
  category: ArtworkCategory;
  description: string;
  story: string;
  material: string;
  year: string;
  location: string;
  featured: boolean;
  status: ArtworkStatus;
  images: ArtworkImage[];
  createdAt: Date;
  updatedAt: Date;
}
