import { Injectable } from '@nestjs/common';
import { Prisma, User } from '../../../generated/prisma/client.js';
import { CriteriaBuilder } from '../../common/criteria/builder.criteria.js';
import { PrismaService } from '../../prisma.service.js';
import {
  ActiveTripCriteria,
  TripOwnerCriteria,
  TripTypeCriteria,
} from '../criteria/filters.criteria.js';
import { FindTripsDto } from '../dto/find-trips.dto.js';
import { TripSearchCriteria } from '../criteria/trip-search.criteria.js';

@Injectable()
export class FindAllTripsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(findTripsDto: FindTripsDto, user: User) {
    const where = new CriteriaBuilder<Prisma.TripWhereInput>()
      .add(new ActiveTripCriteria())
      .add(new TripTypeCriteria(findTripsDto.type))
      .add(new TripOwnerCriteria(user.id))
      .add(new TripSearchCriteria(findTripsDto.search))
      .build();

    const [data, total] = await Promise.all([
      this.prisma.trip.findMany({
        include: {
          driver: true,
          vehicle: true,
          expenses: true,
        },
        skip: findTripsDto.skip,
        take: findTripsDto.limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.trip.count({ where }),
    ]);

    const lastPage = Math.ceil(total / findTripsDto.limit);

    return {
      data,
      meta: {
        total,
        page: findTripsDto.page,
        lastPage,
        limit: findTripsDto.limit,
        hasNext: findTripsDto.page < lastPage,
        hasPrev: findTripsDto.page > 1,
      },
    };
  }
}
