import { IsIn, IsOptional } from 'class-validator';
import {
  MEDIA_STATUSES,
  MEDIA_TYPES,
  MediaStatus,
  MediaType,
} from '../media.constants';

export class QueryMediaDto {
  @IsOptional()
  @IsIn(MEDIA_TYPES)
  type?: MediaType;

  /** Honoured on admin routes only; public routes always return PUBLISHED. */
  @IsOptional()
  @IsIn(MEDIA_STATUSES)
  status?: MediaStatus;
}
