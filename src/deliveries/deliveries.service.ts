import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto.js';
import { UpdateDeliveryDto } from './dto/update-delivery.dto.js';
import { PrismaService } from '../prisma.service.js';
import { Page } from '../common/interfaces/page.interface.js';
import { Deliveries, Prisma } from '../../generated/prisma/client.js';
import {
  ActiveDeliveryCriteria,
  DeliveryTypeCriteria,
} from './criteria/filters.criteria.js';
import { FindDeliveriesDto } from './dto/find-deliveries.dto.js';
import { CriteriaBuilder } from '../common/criteria/builder.criteria.js';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async create(createDeliveryDto: CreateDeliveryDto) {
    return await this.prisma.deliveries.create({
      data: createDeliveryDto,
    });
  }

  async findAll(
    findDeliveriesDto: FindDeliveriesDto,
  ): Promise<Page<Deliveries>> {
    const where = new CriteriaBuilder<Prisma.DeliveriesWhereInput>()
      .add(new ActiveDeliveryCriteria())
      .add(new DeliveryTypeCriteria(findDeliveriesDto.type))
      .build();

    const [data, total] = await Promise.all([
      this.prisma.deliveries.findMany({
        skip: findDeliveriesDto.skip,
        take: findDeliveriesDto.limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.deliveries.count({ where }),
    ]);

    const lastPage = Math.ceil(total / (findDeliveriesDto.limit ?? 10));

    return {
      data,
      meta: {
        total,
        page: findDeliveriesDto.page ?? 1,
        lastPage,
        limit: findDeliveriesDto.limit ?? 10,
        hasNext: (findDeliveriesDto.page ?? 1) < lastPage,
        hasPrev: (findDeliveriesDto.page ?? 1) > 1,
      },
    };
  }

  async findOne(id: string) {
    const delivery = await this.prisma.deliveries.findFirst({
      where: { id, deletedAt: null },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    return delivery;
  }

  async update(id: string, updateDeliveryDto: UpdateDeliveryDto) {
    const delivery = await this.prisma.deliveries.findFirst({
      where: { id, deletedAt: null },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    return await this.prisma.deliveries.update({
      where: { id },
      data: updateDeliveryDto,
    });
  }

  async remove(id: string) {
    const delivery = await this.prisma.deliveries.findFirst({
      where: { id, deletedAt: null },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    const deletedDelivery = await this.prisma.$queryRaw<Deliveries[]>`
      UPDATE "deliveries"
      SET "deleted_at" = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `;

    if (!deletedDelivery || deletedDelivery.length === 0) {
      throw new NotFoundException(
        `Delivery with ID ${id} could not be deleted or was not found`,
      );
    }

    return deletedDelivery[0];
  }
}
