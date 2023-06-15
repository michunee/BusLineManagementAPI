import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DriverService } from './service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Person } from 'src/entities/person';
import { DriverInput } from './model';

@Controller('driver')
export class DriverController {
  constructor(private service: DriverService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  public getDrivers(
    @CurrentUser() currentPerson: Person,
    @Query('filter') filter: string,
  ) {
    return this.service.getDrivers(currentPerson, filter);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('active')
  public getActiveDrivers(@CurrentUser() currentPerson: Person) {
    return this.service.getActiveDrivers(currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('status')
  public changeDriverStatus(
    @Body() input: { DriverID: number; IsActive: boolean },
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.changeDriverStatus(input, currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  public insertDriver(
    @Body() input: DriverInput,
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.insertDriver(input, currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  public updateDriver(
    @Body() input: DriverInput,
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.updateDriver(input, currentPerson);
  }
}
