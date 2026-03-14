import { HttpStatus, Injectable } from '@nestjs/common';
import { User, Delivery } from '../../../generated/prisma/client.js';
import { ExceptionCodes } from '../../common/enums/exception-codes.js';
import { BusinessException } from '../../common/exceptions/business-exception.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class SoftDeleteTripUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(tripId: string, userId: User) {
    return await this.prisma.$transaction(async (tx) => {
      const trip = await tx.delivery.findUnique({
        where: { id: tripId, userId: userId.id, deletedAt: null },
      });

      if (!trip) {
        throw new BusinessException(
          'Trip not found or deleted',
          ExceptionCodes.NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedTrips = await tx.$queryRaw<Delivery[]>`
        UPDATE "deliveries"
        SET "deleted_at" = NOW()
        WHERE id = ${tripId}
        RETURNING *
      `;

      const deletedTrip = updatedTrips[0];

      await tx.$queryRaw`
        UPDATE "expenses"
        SET "deleted_at" = NOW()
        WHERE "delivery_id" = ${deletedTrip.id}
          AND "deleted_at" IS NULL
      `;

      return deletedTrip;
    });
  }
}
