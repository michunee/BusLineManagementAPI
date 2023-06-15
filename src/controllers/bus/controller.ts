import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BusService } from './service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Person } from 'src/entities/person';
import { BusInput } from './model';

@Controller('bus')
export class BusController {
  constructor(private service: BusService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  public getBuses(
    @CurrentUser() currentPerson: Person,
    @Query('filter') filter: string,
    @Query('busTypeID') busTypeID: string,
  ) {
    return this.service.getBuses(currentPerson, filter, Number(busTypeID));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('active')
  public getActiveBuses(@CurrentUser() currentPerson: Person) {
    return this.service.getActiveBuses(currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('status')
  public changeBusStatus(
    @Body() input: { BusID: number; IsActive: boolean },
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.changeBusStatus(input, currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  public insertBus(
    @Body() input: BusInput,
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.insertBus(input, currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  public updateBus(
    @Body() input: BusInput,
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.updateBus(input, currentPerson);
  }
}
