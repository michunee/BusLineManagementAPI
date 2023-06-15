import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TripService } from './service';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Person } from 'src/entities/person';
import { TripInput } from './model';

@Controller('trip')
export class TripController {
  constructor(private service: TripService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  public getTrips(
    @Query('startProvinceID') startProvinceID?: number,
    @Query('endProvinceID') endProvinceID?: number,
    @Query('tripDate') tripDate?: string,
    @Query('page') page?: number,
    @Query('IsForUser') IsForUser?: number,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.service.getTrips(
      startProvinceID,
      endProvinceID,
      tripDate,
      page,
      IsForUser,
      month,
      year,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('cancel')
  public changeTripCancelledStatus(
    @Body() input: { TripID: number; IsCancelled: boolean },
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.changeTripCancelledStatus(input, currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('complete')
  public changeTripCompletedStatus(
    @Body() input: { TripID: number; IsCompleted: boolean },
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.changeTripCompletedStatus(input, currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public getTrip(@Param('id') ID: string) {
    return this.service.getTrip(Number(ID));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  public insertTrip(
    @Body() input: TripInput,
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.insertTrip(input, currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  public updateTrip(
    @Body() input: TripInput,
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.updateTrip(input, currentPerson);
  }
}
