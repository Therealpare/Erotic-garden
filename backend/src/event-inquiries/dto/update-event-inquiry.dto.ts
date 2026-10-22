import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { INQUIRY_STATUSES, InquiryStatus } from '../event-inquiry.constants';

export class UpdateEventInquiryDto {
  @IsOptional()
  @IsIn(INQUIRY_STATUSES)
  status?: InquiryStatus;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  adminNotes?: string;
}
