import { Module } from '@nestjs/common';
import { DeliveriesModule } from './deliveries/deliveries.module.js';
import { CommonModule } from './common/common.module.js';

@Module({
  imports: [DeliveriesModule, CommonModule],
})
export class AppModule {}
