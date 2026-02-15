import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ExceptionCodes } from '../enums/exception-codes.js';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isHttpException: boolean = exception instanceof HttpException;
    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = exception.message;
    let code: ExceptionCodes = ExceptionCodes.INTERNAL_SERVER_ERROR;

    if (isHttpException) {
      status = exception.getStatus();

      const errorResponse = exception.getResponse();
      message = errorResponse['message'] ?? exception.message;
      code = errorResponse['code'];

      if (!code) {
        switch (status) {
          case HttpStatus.BAD_REQUEST:
            code = ExceptionCodes.BAD_REQUEST;
            break;
          case HttpStatus.UNAUTHORIZED:
            code = ExceptionCodes.UNAUTHORIZED;
            break;
          case HttpStatus.FORBIDDEN:
            code = ExceptionCodes.FORBIDDEN;
            break;
          case HttpStatus.NOT_FOUND:
            code = ExceptionCodes.NOT_FOUND;
            break;
          case HttpStatus.CONFLICT:
            code = ExceptionCodes.CONFLICT;
            break;
          default:
            code = ExceptionCodes.INTERNAL_SERVER_ERROR;
        }
      }
    }

    const formatMessage = Array.isArray(message) ? message.join(', ') : message;
    this.logger.error(
      `Status: ${status} | Code: ${code} | Message: ${formatMessage}`,
    );

    const errorBody = {
      statusCode: status,
      errorCode: code,
      message: isHttpException ? formatMessage : 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorBody);
  }
}
