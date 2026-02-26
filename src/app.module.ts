import { Module } from '@nestjs/common';
import { DeliveriesModule } from './deliveries/deliveries.module.js';
import { CommonModule } from './common/common.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ExpensesModule } from './expenses/expenses.module.js';
import { UsersModule } from './users/users.module.js';
import { TrucksModule } from './trucks/trucks.module.js';
import { DriversModule } from './drivers/drivers.module.js';

@Module({
  imports: [
    DeliveriesModule,
    CommonModule,
    AuthModule,
    ExpensesModule,
    UsersModule,
    TrucksModule,
    DriversModule,
  ],
})
export class AppModule {}
