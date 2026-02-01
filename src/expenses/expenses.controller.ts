import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import type { User } from '../../generated/prisma/client.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { FindExpensesDto } from './dto/find-expenses.dto.js';

@Controller({ path: 'expenses', version: '1' })
@Auth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get('categories')
  findCategories() {
    return this.expensesService.findCategories();
  }

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @GetUser() user: User) {
    return this.expensesService.create(createExpenseDto, user);
  }

  @Get()
  findAll(@Query() findExpensesDto: FindExpensesDto, @GetUser() user: User) {
    return this.expensesService.findAll(findExpensesDto, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.expensesService.remove(id);
  }
}
