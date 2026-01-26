import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface.js';
import { PrismaService } from '../../prisma.service.js';
import { envs } from '../../config/envs.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      secretOrKey: envs.auth.accessToken.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { sub } = payload;

    const user = await this.prismaService.users.findFirst({
      where: { id: sub, deletedAt: null },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    const { password: _password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
