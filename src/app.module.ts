import { Module } from '@nestjs/common';
import { DeliveriesModule } from './deliveries/deliveries.module.js';
import { CommonModule } from './common/common.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [DeliveriesModule, CommonModule, AuthModule],
})
export class AppModule {}
