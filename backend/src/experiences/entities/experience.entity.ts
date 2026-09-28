export type ExperienceStatus = 'PUBLISHED' | 'DRAFT';

/** Mirrors spec §24/§35 `experiences` table. */
export class Experience {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  duration: string;
  price: string;
  imageUrl: string;
  featured: boolean;
  status: ExperienceStatus;
  createdAt: Date;
  updatedAt: Date;
}
