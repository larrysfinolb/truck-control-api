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
import { FindDriversDto } from './dto/find-drivers.dto.js';
import type { User } from '../../generated/prisma/client.js';
import { UpdateDriverDto } from './dto/update-driver.dto.js';
import { DriversService } from './drivers.service.js';
import { CreateDriverDto } from './dto/create-driver.dto.js';

@Controller({
  path: 'drivers',
  version: '1',
})
@Auth()
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto, @GetUser() user: User) {
    return this.driversService.create(createDriverDto, user);
  }

  @Get()
  findAll(@Query() findDriversDto: FindDriversDto, @GetUser() user: User) {
    return this.driversService.findAll(findDriversDto, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.driversService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.driversService.remove(id);
  }
}
