import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../../generated/prisma/client.js';
import { ExceptionCodes } from '../../common/enums/exception-codes.js';
import { BusinessException } from '../../common/exceptions/business-exception.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = User>(
    err: any,
    user: any,
    _info: any,
    _context: ExecutionContext,
    _status?: any,
  ): TUser {
    if (err || !user) {
      throw new BusinessException(
        'Invalid token',
        ExceptionCodes.INVALID_TOKEN,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user as TUser;
  }
}
