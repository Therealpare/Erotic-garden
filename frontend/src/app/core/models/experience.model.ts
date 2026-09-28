export interface Experience {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  duration: string;
  price: string;
  imageUrl: string;
  featured: boolean;
  status: 'PUBLISHED' | 'DRAFT';
}
