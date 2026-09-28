export type GalleryCategorySlug = 'garden' | 'art' | 'tea-house' | 'people';

export class GalleryCategory {
  id: number;
  name: string;
  slug: GalleryCategorySlug;
}

export class GalleryImage {
  id: number;
  categorySlug: GalleryCategorySlug;
  title: string;
  imageUrl: string;
  publicId: string;
  description: string;
  altText: string;
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
}
