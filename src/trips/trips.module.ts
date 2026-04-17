import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaService } from '../prisma.service.js';
import { TripsController } from './trips.controller.js';
import { CreateTripUseCase } from './use-cases/create-trip.use-case.js';
import { FindAllTripsUseCase } from './use-cases/find-all-trips.use-case.js';
import { FindTripByIdUseCase } from './use-cases/find-trip-by-id.use-case.js';
import { SoftDeleteTripUseCase } from './use-cases/soft-delete-trip.use-case.js';
import { UpdateTripUseCase } from './use-cases/update-trip.use-case.js';

@Module({
  imports: [AuthModule],
  controllers: [TripsController],
  providers: [
    PrismaService,
    CreateTripUseCase,
    FindAllTripsUseCase,
    FindTripByIdUseCase,
    SoftDeleteTripUseCase,
    UpdateTripUseCase,
  ],
})
export class TripsModule {}
