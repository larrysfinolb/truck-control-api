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
import { Auth } from '../auth/decorators/auth.decorator.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { FindTrucksDto } from './dto/find-trucks.dto.js';
import type { User } from '../../generated/prisma/client.js';
import { TrucksService } from './trucks.service.js';
import { CreateTruckDto } from './dto/create-truck.dto.js';
import { UpdateTruckDto } from './dto/update-truck.dto.js';

@Controller({
  path: 'trucks',
  version: '1',
})
@Auth()
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) {}

  @Post()
  create(@Body() createTruckDto: CreateTruckDto, @GetUser() user: User) {
    return this.trucksService.create(createTruckDto, user);
  }

  @Get()
  findAll(@Query() findTrucksDto: FindTrucksDto, @GetUser() user: User) {
    return this.trucksService.findAll(findTrucksDto, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTruckDto: UpdateTruckDto,
  ) {
    return this.trucksService.update(id, updateTruckDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.trucksService.remove(id);
  }
}
