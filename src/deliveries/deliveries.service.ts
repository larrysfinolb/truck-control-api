import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto.js';
import { UpdateDeliveryDto } from './dto/update-delivery.dto.js';
import { PrismaService } from '../prisma.service.js';
import { Page } from '../common/interfaces/page.interface.js';
import { Delivery, Prisma, User } from '../../generated/prisma/client.js';
import {
  ActiveDeliveryCriteria,
  DeliveryOwnerCriteria,
  DeliveryTypeCriteria,
} from './criteria/filters.criteria.js';
import { FindDeliveriesDto } from './dto/find-deliveries.dto.js';
import { CriteriaBuilder } from '../common/criteria/builder.criteria.js';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async create(createDeliveryDto: CreateDeliveryDto, user: User) {
    return await this.prisma.delivery.create({
      data: {
        ...createDeliveryDto,
        userId: user.id,
      },
    });
  }

  async findAll(
    findDeliveriesDto: FindDeliveriesDto,
    user: User,
  ): Promise<Page<Delivery>> {
    const where = new CriteriaBuilder<Prisma.DeliveryWhereInput>()
      .add(new ActiveDeliveryCriteria())
      .add(new DeliveryTypeCriteria(findDeliveriesDto.type))
      .add(new DeliveryOwnerCriteria(user.id))
      .build();

    const [data, total] = await Promise.all([
      this.prisma.delivery.findMany({
        include: {
          driver: true,
          vehicle: true,
        },
        skip: findDeliveriesDto.skip,
        take: findDeliveriesDto.limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.delivery.count({ where }),
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
    const delivery = await this.prisma.delivery.findFirst({
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

  async remove(id: string) {
    const delivery = await this.prisma.delivery.findFirst({
      where: { id, deletedAt: null },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    const deletedDelivery = await this.prisma.$queryRaw<Delivery[]>`
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
