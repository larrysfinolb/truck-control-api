import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTripDto } from './create-trip.dto.js';

export class UpdateTripDto extends PartialType(
  OmitType(CreateTripDto, ['type'] as const),
) {}
