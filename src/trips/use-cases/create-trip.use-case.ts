import { Injectable } from '@nestjs/common';
import { TripType, User } from '../../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { CreateTripDto } from '../dto/create-trip.dto.js';
import { calculateFixedRateTotalPayment } from '../helpers/calculate-fixed-rate-total-payment.helper.js';
import { calculatePerMileTotalPayment } from '../helpers/calculate-per-mile-total-payment.helper.js';

@Injectable()
export class CreateTripUseCase {
  constructor(private readonly prisma: PrismaService) {}

  execute(createTripDto: CreateTripDto, user: User) {
    const tripData =
      createTripDto.type === TripType.FIXED_RATE
        ? this.buildFixedRateTripData(createTripDto)
        : this.buildPerMileTripData(createTripDto);

    return this.prisma.trip.create({
      data: {
        ...createTripDto,
        ...tripData,
        userId: user.id,
      },
      include: {
        driver: true,
        vehicle: true,
        expenses: true,
      },
    });
  }

  private buildFixedRateTripData(createTripDto: CreateTripDto) {
    return {
      rate: createTripDto.rate,
      carrierFee: createTripDto.carrierFee,
      totalPayment: calculateFixedRateTotalPayment(
        createTripDto.rate,
        createTripDto.carrierFee,
      ),
    };
  }

  private buildPerMileTripData(createTripDto: CreateTripDto) {
    return {
      miles: createTripDto.miles,
      ratePerMile: createTripDto.ratePerMile,
      deadheadMiles: createTripDto.deadheadMiles,
      ratePerDeadheadMile: createTripDto.ratePerDeadheadMile,
      totalPayment: calculatePerMileTotalPayment(
        createTripDto.miles,
        createTripDto.ratePerMile,
        createTripDto.deadheadMiles,
        createTripDto.ratePerDeadheadMile,
      ),
    };
  }
}
