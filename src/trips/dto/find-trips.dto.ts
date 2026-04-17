import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TripType } from '../../../generated/prisma/enums.js';
import { PaginationDto } from '../../common/dto/pagination.dto.js';

export class FindTripsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(TripType)
  type?: TripType;

  @IsOptional()
  @IsString()
  search?: string;
}
