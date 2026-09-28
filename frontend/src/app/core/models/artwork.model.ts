export type ArtworkCategory = 'SCULPTURE' | 'GARDEN';

export interface ArtworkImage {
  id: number;
  artworkId: number;
  imageUrl: string;
  altText: string;
  sortOrder: number;
}

export interface Artwork {
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
  status: 'PUBLISHED' | 'DRAFT';
  coverImageUrl: string;
  images: ArtworkImage[];
}
