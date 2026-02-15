import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import type { User } from '../../generated/prisma/client.js';

@Controller({
  path: 'users',
  version: '1',
})
@Auth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/profile')
  findProfile(@GetUser() user: User) {
    return this.usersService.findProfile(user.id);
  }
}
