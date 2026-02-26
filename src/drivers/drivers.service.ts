import { HttpStatus, Injectable } from '@nestjs/common';
import { Driver, Prisma, User } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma.service.js';
import { CriteriaBuilder } from '../common/criteria/builder.criteria.js';
import { Page } from '../common/interfaces/page.interface.js';
import { ExceptionCodes } from '../common/enums/exception-codes.js';
import { BusinessException } from '../common/exceptions/business-exception.js';
import { CreateDriverDto } from './dto/create-driver.dto.js';
import { FindDriversDto } from './dto/find-drivers.dto.js';
import { UpdateDriverDto } from './dto/update-driver.dto.js';
import {
  ActiveDriverCriteria,
  DriverOwnerCriteria,
} from './criteria/filters.criteria.js';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDriverDto: CreateDriverDto, user: User) {
    return await this.prisma.driver.create({
      data: {
        ...createDriverDto,
        userId: user.id,
      },
    });
  }

  async findAll(
    findDriversDto: FindDriversDto,
    user: User,
  ): Promise<Page<Driver>> {
    const where = new CriteriaBuilder<Prisma.DriverWhereInput>()
      .add(new ActiveDriverCriteria())
      .add(new DriverOwnerCriteria(user.id))
      .build();

    const [data, total] = await Promise.all([
      this.prisma.driver.findMany({
        skip: findDriversDto.skip,
        take: findDriversDto.limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.driver.count({
        where,
      }),
    ]);

    const lastPage = Math.ceil(total / (findDriversDto.limit ?? 10));

    return {
      data,
      meta: {
        total,
        page: findDriversDto.page ?? 1,
        lastPage,
        limit: findDriversDto.limit ?? 10,
        hasNext: (findDriversDto.page ?? 1) < lastPage,
        hasPrev: (findDriversDto.page ?? 1) > 1,
      },
    };
  }

  async findOne(id: string) {
    const driver = await this.prisma.driver.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!driver) {
      throw new BusinessException(
        'Driver not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return driver;
  }

  async update(id: string, updateDriverDto: UpdateDriverDto) {
    const driver = await this.prisma.driver.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!driver) {
      throw new BusinessException(
        'Driver not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.prisma.driver.update({
      where: { id },
      data: updateDriverDto,
    });
  }

  async remove(id: string) {
    const driver = await this.prisma.driver.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!driver) {
      throw new BusinessException(
        'Driver not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const deletedTruck = await this.prisma.$queryRaw<Driver[]>`
      UPDATE "drivers"
      SET "deleted_at" = CURRENT_TIMESTAMP
      WHERE "id" = ${id}
      RETURNING *
    `;

    if (!deletedTruck || deletedTruck.length === 0) {
      throw new BusinessException(
        'Driver could not be deleted or was not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return deletedTruck[0];
  }
}
