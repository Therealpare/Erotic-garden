import {
  Equals,
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  CONTACT_PREFERENCES,
  ContactPreference,
  EVENT_TYPES,
  EventType,
} from '../event-inquiry.constants';

export class CreateEventInquiryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @Matches(/^[+\d][\d\s()-]{5,38}$/, {
    message: 'phone must be a valid phone number',
  })
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  organization?: string;

  @IsIn(EVENT_TYPES)
  eventType: EventType;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'preferredDate must be in YYYY-MM-DD format',
  })
  preferredDate: string;

  @IsOptional()
  @IsBoolean()
  flexibleDate?: boolean;

  @IsInt()
  @Min(1)
  @Max(1000)
  guestCount: number;

  @IsOptional()
  @IsIn(CONTACT_PREFERENCES)
  contactPreference?: ContactPreference;

  @ValidateIf((dto: CreateEventInquiryDto) => dto.contactPreference === 'LINE')
  @IsString()
  @IsNotEmpty({ message: 'lineId is required when contactPreference is LINE' })
  @MaxLength(60)
  lineId?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(3000)
  message: string;

  @Equals(true, { message: 'consent must be accepted' })
  consent: boolean;

  /** Honeypot: hidden from people, so any value marks the request as automated. */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}
