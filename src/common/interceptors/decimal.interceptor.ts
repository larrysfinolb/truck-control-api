import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client.js';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DecimalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.transform(data)));
  }

  private transform(data: any): unknown {
    if (data == null) {
      return data;
    }

    if (data instanceof Date) {
      return data;
    }

    if (Prisma.Decimal.isDecimal(data)) {
      return data.toNumber();
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.transform(item));
    }

    if (typeof data === 'object') {
      const transformed: Record<string, any> = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          transformed[key] = this.transform(data[key]);
        }
      }
      return transformed;
    }

    return data;
  }
}
