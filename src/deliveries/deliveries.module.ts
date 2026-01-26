import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service.js';
import { DeliveriesController } from './deliveries.controller.js';
import { PrismaService } from '../prisma.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [DeliveriesController],
  providers: [DeliveriesService, PrismaService],
})
export class DeliveriesModule {}
