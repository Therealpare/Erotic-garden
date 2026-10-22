import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { INQUIRY_STATUSES, InquiryStatus } from '../event-inquiry.constants';

export class QueryEventInquiriesDto {
  @IsOptional()
  @IsIn(INQUIRY_STATUSES)
  status?: InquiryStatus;

  /** Matches name, email, phone or reference code. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}
