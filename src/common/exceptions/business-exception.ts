import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionCodes } from '../enums/exception-codes.js';

export class BusinessException extends HttpException {
  constructor(message: string, code: ExceptionCodes, status: HttpStatus) {
    super(
      {
        message: message,
        code: code,
      },
      status,
    );
  }
}
