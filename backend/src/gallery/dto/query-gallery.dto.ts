import { IsIn, IsOptional } from 'class-validator';
import { GalleryCategorySlug } from '../entities/gallery.entity';

const CATEGORY_SLUGS: GalleryCategorySlug[] = [
  'garden',
  'art',
  'tea-house',
  'people',
];

export class QueryGalleryDto {
  @IsOptional()
  @IsIn(CATEGORY_SLUGS)
  category?: GalleryCategorySlug;
}
