import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'generated/prisma/browser.js';

export const GetUser = createParamDecorator(
  (
    data: keyof User | undefined,
    ctx: ExecutionContext,
  ): User | User[keyof User] => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }

    return !data ? user : user[data];
  },
);
