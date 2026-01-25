import { IsEnum, IsOptional } from 'class-validator';
import { DeliveryType } from '../../../generated/prisma/enums.js';
import { PaginationDto } from '../../common/dto/pagination.dto.js';

export class FindDeliveriesDto extends PaginationDto {
  @IsOptional()
  @IsEnum(DeliveryType)
  type?: DeliveryType;
}
