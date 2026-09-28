export type GalleryCategorySlug = 'garden' | 'art' | 'tea-house' | 'people';

export interface GalleryCategory {
  id: number;
  name: string;
  slug: GalleryCategorySlug;
}

export interface GalleryImage {
  id: number;
  categorySlug: GalleryCategorySlug;
  title: string;
  imageUrl: string;
  description: string;
  altText: string;
  featured: boolean;
  sortOrder: number;
}
