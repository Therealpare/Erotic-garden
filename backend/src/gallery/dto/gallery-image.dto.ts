import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { IsImageUrl } from '../../common/dto/image-url.validator';

export class CreateGalleryImageDto {
  @IsInt()
  @IsPositive()
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsImageUrl()
  imageUrl: string;

  /** Describes the photo for screen readers; required for accessibility (spec §44). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  altText: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100_000)
  sortOrder?: number;
}

export class UpdateGalleryImageDto extends PartialType(CreateGalleryImageDto) {}
