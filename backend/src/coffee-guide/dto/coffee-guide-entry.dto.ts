import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
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
  COFFEE_GUIDE_STATUSES,
  CoffeeGuideStatus,
} from '../coffee-guide.constants';

/** Admins edit the text, picture, visibility and order; kind and key stay fixed. */
export class UpdateCoffeeGuideEntryDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedNameDto)
  name?: LocalizedNameDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedDescriptionDto)
  summary?: LocalizedDescriptionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedDescriptionDto)
  flavor?: LocalizedDescriptionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocalizedDescriptionDto)
  brewing?: LocalizedDescriptionDto;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsImageUrl()
  imageUrl?: string | null;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @MaxLength(300)
  imageAlt?: string | null;

  @IsOptional()
  @IsIn(COFFEE_GUIDE_STATUSES)
  status?: CoffeeGuideStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100_000)
  sortOrder?: number;
}
