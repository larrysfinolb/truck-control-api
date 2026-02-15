import { HttpStatus, Injectable } from '@nestjs/common';
import { ExceptionCodes } from '../common/enums/exception-codes.js';
import { BusinessException } from '../common/exceptions/business-exception.js';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findProfile(userId: string) {
    // ! This method could return the user got in the guard.
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new BusinessException(
        'User not found',
        ExceptionCodes.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }
}
