import { Module } from '@nestjs/common';
import { DeliveriesModule } from './deliveries/deliveries.module.js';
import { CommonModule } from './common/common.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ExpensesModule } from './expenses/expenses.module.js';

@Module({
  imports: [DeliveriesModule, CommonModule, AuthModule, ExpensesModule],
})
export class AppModule {}
