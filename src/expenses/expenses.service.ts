import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import {
  Expense,
  ExpenseCategory,
  Prisma,
  User,
} from '../../generated/prisma/client.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { FindExpensesDto } from './dto/find-expenses.dto.js';
import { CriteriaBuilder } from '../common/criteria/builder.criteria.js';
import {
  ActiveExpenseCriteria,
  ExpenseOwnerCriteria,
} from './criteria/filters.criteria.js';
import { Page } from '../common/interfaces/page.interface.js';
import { BusinessException } from '../common/exceptions/business-exception.js';
import { ExceptionCodes } from '../common/enums/exception-codes.js';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto, user: User) {
    return await this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        userId: user.id,
      },
    });
  }

  async findAll(
    findExpensesDto: FindExpensesDto,
    user: User,
  ): Promise<Page<Expense>> {
    const where = new CriteriaBuilder<Prisma.ExpenseWhereInput>()
      .add(new ActiveExpenseCriteria())
      .add(new ExpenseOwnerCriteria(user.id))
      .build();

    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({
        skip: findExpensesDto.skip,
        take: findExpensesDto.limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.expense.count({ where }),
    ]);

    const lastPage = Math.ceil(total / (findExpensesDto.limit ?? 10));

    return {
      data,
      meta: {
        total,
        page: findExpensesDto.page ?? 1,
        lastPage,
        limit: findExpensesDto.limit ?? 10,
        hasNext: (findExpensesDto.page ?? 1) < lastPage,
        hasPrev: (findExpensesDto.page ?? 1) > 1,
      },
    };
  }

  async findOne(id: string) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!expense) {
      throw new BusinessException(
        'Expense not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!expense) {
      throw new BusinessException(
        'Expense not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.expense.update({
      where: { id },
      data: updateExpenseDto,
    });
  }

  async remove(id: string) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!expense) {
      throw new BusinessException(
        'Expense not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const deletedExpense = await this.prisma.$queryRaw<Expense[]>`
      UPDATE "expenses"
      SET "deleted_at" = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *;
    `;

    if (!deletedExpense || deletedExpense.length === 0) {
      throw new BusinessException(
        'Expense could not be deleted or was not found',
        ExceptionCodes.NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return deletedExpense[0];
  }

  findCategories() {
    return Object.values(ExpenseCategory);
  }
}
