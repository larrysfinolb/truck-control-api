import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Users } from 'generated/prisma/browser.js';

export const GetUser = createParamDecorator(
  (
    data: keyof Users | undefined,
    ctx: ExecutionContext,
  ): Users | Users[keyof Users] => {
    const request = ctx.switchToHttp().getRequest();
    const user: Users = request.user;

    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }

    return !data ? user : user[data];
  },
);
