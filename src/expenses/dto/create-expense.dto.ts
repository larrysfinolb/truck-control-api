import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseCategory } from '../../../generated/prisma/enums.js';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  deliveryId: string;

  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsDate()
  @Type(() => Date)
  incurredAt: Date;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  note?: string;
}
