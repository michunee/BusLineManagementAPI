import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StationService } from './service';
import { AuthGuard } from '@nestjs/passport';
import { Person } from 'src/entities/person';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { StationInput } from './model';

@Controller('station')
export class StationController {
  constructor(private service: StationService) {}

  @Get()
  public getStations(
    @Query('provinceID') ProvinceID: number,
    @Query('filter') filter: string,
    @Query('IsActive') IsActive: boolean,
  ) {
    return this.service.getStations(ProvinceID, filter, IsActive);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('status')
  public changeStationStatus(
    @Body() input: { StationID: number; IsActive: boolean },
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.changeStationStatus(input, currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  public insertStation(
    @Body() input: StationInput,
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.insertStation(input, currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  public updateStation(
    @Body() input: StationInput,
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.updateStation(input, currentPerson);
  }
}
