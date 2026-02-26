import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, Truck, User } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';
import { CreateTruckDto } from './dto/create-truck.dto.js';
import { FindTrucksDto } from './dto/find-trucks.dto.js';
import { CriteriaBuilder } from '../common/criteria/builder.criteria.js';
import {
  ActiveTruckCriteria,
  TruckOwnerCriteria,
} from './criteria/filters.criteria.js';
import { Page } from '../common/interfaces/page.interface.js';
import { ExceptionCodes } from '../common/enums/exception-codes.js';
import { BusinessException } from '../common/exceptions/business-exception.js';
import { UpdateTruckDto } from './dto/update-truck.dto.js';

@Injectable()
export class TrucksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTruckDto: CreateTruckDto, user: User) {
    return await this.prisma.truck.create({
      data: {
        ...createTruckDto,
        userId: user.id,
      },
    });
  }

  async findAll(
    findTrucksDto: FindTrucksDto,
    user: User,
  ): Promise<Page<Truck>> {
    const where = new CriteriaBuilder<Prisma.TruckWhereInput>()
      .add(new ActiveTruckCriteria())
      .add(new TruckOwnerCriteria(user.id))
      .build();

    const [data, total] = await Promise.all([
      this.prisma.truck.findMany({
        skip: findTrucksDto.skip,
        take: findTrucksDto.limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.truck.count({
        where,
      }),
    ]);

    const lastPage = Math.ceil(total / (findTrucksDto.limit ?? 10));

    return {
      data,
      meta: {
        total,
        page: findTrucksDto.page ?? 1,
        lastPage,
        limit: findTrucksDto.limit ?? 10,
        hasNext: (findTrucksDto.page ?? 1) < lastPage,
        hasPrev: (findTrucksDto.page ?? 1) > 1,
      },
    };
  }

  async findOne(id: string) {
    const truck = await this.prisma.truck.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!truck) {
      throw new BusinessException(
        'Truck not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return truck;
  }

  async update(id: string, updateTruckDto: UpdateTruckDto) {
    const truck = await this.prisma.truck.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!truck) {
      throw new BusinessException(
        'Truck not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.prisma.truck.update({
      where: { id },
      data: updateTruckDto,
    });
  }

  async remove(id: string) {
    const expense = await this.prisma.truck.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!expense) {
      throw new BusinessException(
        'Truck not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const deletedTruck = await this.prisma.$queryRaw<Truck[]>`
      UPDATE "trucks"
      SET "deleted_at" = CURRENT_TIMESTAMP
      WHERE "id" = ${id}
      RETURNING *
    `;

    if (!deletedTruck || deletedTruck.length === 0) {
      throw new BusinessException(
        'Truck could not be deleted or was not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return deletedTruck[0];
  }
}
