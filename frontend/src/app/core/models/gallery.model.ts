export type GalleryCategorySlug = 'garden' | 'art' | 'tea-house' | 'people';

export interface GalleryCategory {
  id: number;
  name: string;
  slug: GalleryCategorySlug;
  sortOrder?: number;
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

/** Shape returned by the admin API (includes unpublished images and the category id). */
export interface AdminGalleryImage extends GalleryImage {
  categoryId: number;
  category: GalleryCategory;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImageInput {
  categoryId: number;
  title: string;
  description: string;
  imageUrl: string;
  altText: string;
  featured: boolean;
  isPublished: boolean;
  sortOrder: number;
}
