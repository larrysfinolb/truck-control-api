import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto.js';
import { UpdateDeliveryDto } from './dto/update-delivery.dto.js';
import { PrismaService } from '../prisma.service.js';
import { User } from '../../generated/prisma/client.js';
import { calculateTotalRate } from './helpers/calculateTotalRate.js';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async create(createDeliveryDto: CreateDeliveryDto, user: User) {
    const { rate, carrierFee } = createDeliveryDto;
    const totalRate = calculateTotalRate(rate, carrierFee);

    return await this.prisma.delivery.create({
      data: {
        ...createDeliveryDto,
        totalRate,
        userId: user.id,
      },
    });
  }

  async findOne(id: string) {
    const delivery = await this.prisma.delivery.findFirst({
      include: {
        driver: true,
        vehicle: true,
        expenses: true,
      },
      where: { id, deletedAt: null },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    return delivery;
  }

  async update(id: string, updateDeliveryDto: UpdateDeliveryDto) {
    const delivery = await this.prisma.delivery.findFirst({
      where: { id, deletedAt: null },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    return await this.prisma.delivery.update({
      where: { id },
      data: updateDeliveryDto,
      include: {
        driver: true,
        vehicle: true,
      },
    });
  }
}
