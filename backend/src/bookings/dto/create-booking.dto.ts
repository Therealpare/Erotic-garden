import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  phone: string;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'visitDate must be in YYYY-MM-DD format',
  })
  visitDate: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'preferredTime must be in HH:mm format',
  })
  preferredTime: string;

  @IsInt()
  @Min(1)
  @Max(20)
  guestCount: number;

  @IsInt()
  @IsPositive()
  experienceId: number;

  @IsOptional()
  @IsString()
  message?: string;
}
