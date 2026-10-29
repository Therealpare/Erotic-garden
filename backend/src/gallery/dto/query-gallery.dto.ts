import { IsOptional, IsString, Matches } from 'class-validator';

export class QueryGalleryDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]{1,60}$/)
  category?: string;
}
