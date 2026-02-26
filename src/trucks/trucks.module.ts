import { Module } from '@nestjs/common';
import { TrucksController } from './trucks.controller.js';
import { TrucksService } from './trucks.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [TrucksController],
  providers: [TrucksService, PrismaService],
})
export class TrucksModule {}
