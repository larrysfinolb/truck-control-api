import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service.js';
import { FindDeliveriesDto } from '../dto/find-deliveries.dto.js';
import { User } from '../../../generated/prisma/client.js';
import { CriteriaBuilder } from '../../common/criteria/builder.criteria.js';
import { Prisma } from 'generated/prisma/browser.js';
import {
  ActiveDeliveryCriteria,
  DeliveryOwnerCriteria,
  DeliveryTypeCriteria,
} from '../criteria/filters.criteria.js';
import { TripSearchCriteria } from '../criteria/trip-search.criteria.js';

@Injectable()
export class FindAllTripsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(findDeliveriesDto: FindDeliveriesDto, user: User) {
    const where = new CriteriaBuilder<Prisma.DeliveryWhereInput>()
      .add(new ActiveDeliveryCriteria())
      .add(new DeliveryTypeCriteria(findDeliveriesDto.type))
      .add(new DeliveryOwnerCriteria(user.id))
      .add(new TripSearchCriteria(findDeliveriesDto.search))
      .build();

    const [data, total] = await Promise.all([
      this.prisma.delivery.findMany({
        include: {
          driver: true,
          vehicle: true,
          expenses: true,
        },
        skip: findDeliveriesDto.skip,
        take: findDeliveriesDto.limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.delivery.count({ where }),
    ]);

    const lastPage = Math.ceil(total / findDeliveriesDto.limit);

    return {
      data,
      meta: {
        total,
        page: findDeliveriesDto.page,
        lastPage,
        limit: findDeliveriesDto.limit,
        hasNext: findDeliveriesDto.page < lastPage,
        hasPrev: findDeliveriesDto.page > 1,
      },
    };
  }
}
