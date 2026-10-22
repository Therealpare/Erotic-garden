import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  MEDIA_STATUSES,
  MEDIA_TYPES,
  MediaStatus,
  MediaType,
} from '../media.constants';

const HTTPS_URL = { protocols: ['https'], require_protocol: true };

export class CreateMediaItemDto {
  @IsIn(MEDIA_TYPES)
  type: MediaType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  source: string;

  @IsUrl(HTTPS_URL, { message: 'url must be an https:// link' })
  @MaxLength(500)
  url: string;

  @IsOptional()
  @IsUrl(HTTPS_URL, { message: 'thumbnailUrl must be an https:// link' })
  @MaxLength(500)
  thumbnailUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string | null;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'publishedAt must be in YYYY-MM-DD format',
  })
  publishedAt?: string | null;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsIn(MEDIA_STATUSES)
  status?: MediaStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10_000)
  sortOrder?: number;
}
