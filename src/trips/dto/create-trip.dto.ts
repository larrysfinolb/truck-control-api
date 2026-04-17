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
import { TripType } from '../../../generated/prisma/enums.js';

export class CreateTripDto {
  @IsEnum(TripType)
  type!: TripType;

  @IsString()
  @IsNotEmpty()
  vehicleId!: string;

  @IsString()
  @IsNotEmpty()
  driverId!: string;

  @IsDate()
  @Type(() => Date)
  pickupDate!: Date;

  @IsString()
  @IsNotEmpty()
  origin!: string;

  @IsString()
  @IsNotEmpty()
  destination!: string;

  @ValidateIf((trip) => trip.type === TripType.FIXED_RATE)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  rate!: number;

  @ValidateIf((trip) => trip.type === TripType.FIXED_RATE)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  carrierFee!: number;

  @ValidateIf((trip) => trip.type === TripType.PER_MILE)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  miles!: number;

  @ValidateIf((trip) => trip.type === TripType.PER_MILE)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  ratePerMile!: number;

  @ValidateIf((trip) => trip.type === TripType.PER_MILE)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  deadheadMiles!: number;

  @ValidateIf((trip) => trip.type === TripType.PER_MILE)
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  ratePerDeadheadMile!: number;
}
