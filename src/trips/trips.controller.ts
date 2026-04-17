import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { User } from '../../generated/prisma/client.js';
import { GetUser } from '../auth/decorators/get-user.decorator.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { CreateTripDto } from './dto/create-trip.dto.js';
import { FindTripsDto } from './dto/find-trips.dto.js';
import { UpdateTripDto } from './dto/update-trip.dto.js';
import { CreateTripUseCase } from './use-cases/create-trip.use-case.js';
import { FindAllTripsUseCase } from './use-cases/find-all-trips.use-case.js';
import { FindTripByIdUseCase } from './use-cases/find-trip-by-id.use-case.js';
import { UpdateTripUseCase } from './use-cases/update-trip.use-case.js';
import { SoftDeleteTripUseCase } from './use-cases/soft-delete-trip.use-case.js';

@Controller({
  path: 'trips',
  version: '1',
})
@Auth()
export class TripsController {
  constructor(
    private readonly createTripUseCase: CreateTripUseCase,
    private readonly findAllTripsUseCase: FindAllTripsUseCase,
    private readonly findTripByIdUseCase: FindTripByIdUseCase,
    private readonly updateTripUseCase: UpdateTripUseCase,
    private readonly softDeleteTripUseCase: SoftDeleteTripUseCase,
  ) {}

  @Post()
  create(@Body() createTripDto: CreateTripDto, @GetUser() user: User) {
    return this.createTripUseCase.execute(createTripDto, user);
  }

  @Get()
  findAll(@Query() findTripsDto: FindTripsDto, @GetUser() user: User) {
    return this.findAllTripsUseCase.execute(findTripsDto, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.findTripByIdUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    return this.updateTripUseCase.execute(id, updateTripDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.softDeleteTripUseCase.execute(id, user);
  }
}
