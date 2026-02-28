import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DeliveryType } from '../../../generated/prisma/enums.js';

export class CreateDeliveryDto {
  @IsEnum(DeliveryType)
  type: DeliveryType;

  @IsString()
  @IsNotEmpty()
  vehicle: string;

  @IsString()
  @IsNotEmpty()
  driver: string;

  @IsDate()
  @Type(() => Date)
  pickupDate: Date;

  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @ValidateIf((o) => o.type === DeliveryType.FIXED_RATE)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  rate: number;

  @ValidateIf((o) => o.type === DeliveryType.FIXED_RATE)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  carrierFee: number;

  @ValidateIf((o) => o.type === DeliveryType.MILEAGE_BASED)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  miles: number;

  @ValidateIf((o) => o.type === DeliveryType.MILEAGE_BASED)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  ratePerMile: number;

  @ValidateIf((o) => o.type === DeliveryType.MILEAGE_BASED)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  deadheadMiles: number;

  @ValidateIf((o) => o.type === DeliveryType.MILEAGE_BASED)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  ratePerDeadheadMile: number;

  @ValidateIf((o) => o.type === DeliveryType.MILEAGE_BASED)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  totalPayment: number;
}
