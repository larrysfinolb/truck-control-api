import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExpenseCategory } from '../../../generated/prisma/enums.js';

export class CreateExpenseDto {
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
