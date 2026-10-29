import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsImageUrl } from '../../common/dto/image-url.validator';
import {
  LocalizedDescriptionDto,
  LocalizedNameDto,
} from '../../common/dto/localized-text.dto';
import {
  PRODUCT_STATUSES,
  ProductStatus,
  VARIANT_STATUSES,
  VariantStatus,
} from '../products.constants';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ProductImageInputDto {
  @IsImageUrl()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  altText: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class ProductVariantInputDto {
  /** Present when updating an existing size; omitted for a new one. */
  @IsOptional()
  @IsInt()
  @IsPositive()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  label: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== null && value !== '')
  @Matches(/^[A-Za-z0-9._-]{1,60}$/, {
    message: 'sku may only contain letters, numbers, dot, dash and underscore',
  })
  sku?: string | null;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1_000_000)
  price: number;

  @IsOptional()
  @Matches(/^[A-Z]{3}$/)
  currency?: string;

  @IsInt()
  @Min(0, { message: 'stock cannot be negative' })
  @Max(1_000_000)
  stock: number;

  @IsOptional()
  @IsIn(VARIANT_STATUSES)
  status?: VariantStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class CreateProductDto {
  @Matches(SLUG, {
    message: 'slug may only contain lowercase letters, numbers and dashes',
  })
  slug: string;

  @ValidateNested()
  @Type(() => LocalizedNameDto)
  name: LocalizedNameDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedDescriptionDto)
  description?: LocalizedDescriptionDto;

  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(160)
  origin?: string | null;
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(160)
  process?: string | null;
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(80)
  roastLevel?: string | null;
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(80)
  altitude?: string | null;
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(80)
  body?: string | null;
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsString()
  @MaxLength(300)
  tastingNotes?: string | null;

  @IsOptional()
  @IsIn(PRODUCT_STATUSES)
  status?: ProductStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  /** Replaces the product's whole image list when provided. */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => ProductImageInputDto)
  images?: ProductImageInputDto[];

  /** Sizes: entries with `id` update that size, entries without create one, missing sizes are removed. */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => ProductVariantInputDto)
  variants?: ProductVariantInputDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class UpdateStockDto {
  @IsInt()
  @Min(0, { message: 'stock cannot be negative' })
  @Max(1_000_000)
  stock: number;
}
