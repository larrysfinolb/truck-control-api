import { HttpStatus, Injectable } from '@nestjs/common';
import { Trip, TripType } from '../../../generated/prisma/client.js';
import { PrismaService } from '../../prisma.service.js';
import { UpdateTripDto } from '../dto/update-trip.dto.js';
import { BusinessException } from '../../common/exceptions/business-exception.js';
import { ExceptionCodes } from '../../common/enums/exception-codes.js';
import { calculateFixedRateTotalPayment } from '../helpers/calculate-fixed-rate-total-payment.helper.js';
import { calculatePerMileTotalPayment } from '../helpers/calculate-per-mile-total-payment.helper.js';

@Injectable()
export class UpdateTripUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string, updateTripDto: UpdateTripDto) {
    const trip = await this.prisma.trip.findFirst({
      where: { id, deletedAt: null },
    });

    if (!trip) {
      throw new BusinessException(
        'Trip not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const tripData =
      trip.type === TripType.FIXED_RATE
        ? this.buildFixedRateTripData(updateTripDto, trip)
        : this.buildPerMileTripData(updateTripDto, trip);

    return this.prisma.trip.update({
      where: { id },
      data: tripData,
      include: {
        driver: true,
        vehicle: true,
        expenses: true,
      },
    });
  }

  private buildFixedRateTripData(updateTripDto: UpdateTripDto, trip: Trip) {
    const rate = Number(updateTripDto.rate ?? trip.rate);
    const carrierFee = Number(updateTripDto.carrierFee ?? trip.carrierFee);

    return {
      ...updateTripDto,
      rate,
      carrierFee,
      totalPayment: calculateFixedRateTotalPayment(rate, carrierFee),
    };
  }

  private buildPerMileTripData(updateTripDto: UpdateTripDto, trip: Trip) {
    const miles = Number(updateTripDto.miles ?? trip.miles);
    const ratePerMile = Number(updateTripDto.ratePerMile ?? trip.ratePerMile);
    const deadheadMiles = Number(
      updateTripDto.deadheadMiles ?? trip.deadheadMiles,
    );
    const ratePerDeadheadMile = Number(
      updateTripDto.ratePerDeadheadMile ?? trip.ratePerDeadheadMile,
    );

    return {
      ...updateTripDto,
      miles,
      ratePerMile,
      deadheadMiles,
      ratePerDeadheadMile,
      totalPayment: calculatePerMileTotalPayment(
        miles,
        ratePerMile,
        deadheadMiles,
        ratePerDeadheadMile,
      ),
    };
  }
}
