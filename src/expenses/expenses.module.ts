import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller.js';
import { ExpensesService } from './expenses.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  imports: [AuthModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, PrismaService],
})
export class ExpensesModule {}
