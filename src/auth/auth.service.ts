import {
  ConflictException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { SignupDto } from './dto/signup.dto.js';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface.js';
import { JwtService } from '@nestjs/jwt';
import { BusinessException } from '../common/exceptions/business-exception.js';
import { ExceptionCodes } from '../common/enums/exception-codes.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new BusinessException(
        'User not found',
        ExceptionCodes.USER_NOT_FOUND,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new BusinessException(
        'Invalid Password',
        ExceptionCodes.INVALID_PASSWORD,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { password: _password, ...userWithoutPassword } = user;
    const accessToken = this.generateJwtToken({ sub: user.id });

    return {
      ...userWithoutPassword,
      accessToken,
    };
  }

  async signup(signupDto: SignupDto) {
    const { firstName, lastName, email, password } = signupDto;

    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      throw new BusinessException(
        'Email already in use',
        ExceptionCodes.EMAIL_ALREADY_IN_USE,
        HttpStatus.CONFLICT,
      );
    }

    const newUser = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync(password, 10),
      },
    });

    const { password: _password, ...userWithoutPassword } = newUser;
    const accessToken = this.generateJwtToken({ sub: newUser.id });

    return {
      ...userWithoutPassword,
      accessToken,
    };
  }

  private generateJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
