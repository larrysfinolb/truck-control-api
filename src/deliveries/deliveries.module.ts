import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service.js';
import { DeliveriesController } from './deliveries.controller.js';
import { PrismaService } from '../prisma.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { SoftDeleteTripUseCase } from './use-cases/soft-delete-trip.use-case.js';

@Module({
  imports: [AuthModule],
  controllers: [DeliveriesController],
  providers: [DeliveriesService, PrismaService, SoftDeleteTripUseCase],
})
export class DeliveriesModule {}
