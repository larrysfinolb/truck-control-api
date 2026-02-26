import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller.js';
import { PrismaService } from '../prisma.service.js';
import { DriversService } from './drivers.service.js';

@Module({
  controllers: [DriversController],
  providers: [DriversService, PrismaService],
})
export class DriversModule {}
