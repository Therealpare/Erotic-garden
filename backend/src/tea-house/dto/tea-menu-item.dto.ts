import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Matches,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { IsImageUrl } from '../../common/dto/image-url.validator';
import {
  LocalizedDescriptionDto,
  LocalizedNameDto,
} from '../../common/dto/localized-text.dto';
import { MENU_ITEM_STATUSES, MenuItemStatus } from '../tea-house.constants';

export class CreateTeaMenuItemDto {
  @IsInt()
  @IsPositive()
  categoryId: number;

  /** URL-safe identifier, unique across the menu. */
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
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
  @ValidateIf((_, value) => value !== null)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1_000_000)
  price?: number | null;

  @IsOptional()
  @IsBoolean()
  includedInAdmission?: boolean;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsImageUrl()
  imageUrl?: string | null;

  @IsOptional()
  @IsIn(MENU_ITEM_STATUSES)
  status?: MenuItemStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100_000)
  sortOrder?: number;
}

export class UpdateTeaMenuItemDto extends PartialType(CreateTeaMenuItemDto) {}
