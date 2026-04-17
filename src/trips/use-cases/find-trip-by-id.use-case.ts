import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionCodes } from '../../common/enums/exception-codes.js';
import { BusinessException } from '../../common/exceptions/business-exception.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class FindTripByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: string) {
    const trip = await this.prisma.trip.findFirst({
      include: {
        driver: true,
        vehicle: true,
        expenses: true,
      },
      where: { id, deletedAt: null },
    });

    if (!trip) {
      throw new BusinessException(
        'Trip not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return trip;
  }
}
