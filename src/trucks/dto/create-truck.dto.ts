import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateTruckDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @IsPositive()
  year: number;

  @IsString()
  color: string;

  @IsString()
  licensePlate: string;

  @IsString()
  vin: string;
}
