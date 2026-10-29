import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  /** The product size (variant) being bought. Prices always come from the database, never the client. */
  @IsInt()
  @IsPositive()
  variantId: number;

  @IsInt()
  @IsPositive()
  @Max(100)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsString()
  @MinLength(6)
  @MaxLength(40)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  contactChannel: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
