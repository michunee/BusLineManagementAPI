import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BusSeatService } from './service';
import { AuthGuard } from '@nestjs/passport';

@Controller('bus-seat')
export class BusSeatController {
  constructor(private service: BusSeatService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  public getBookedBusSeats(@Query('tripID') tripID: number) {
    return this.service.getBookedBusSeats(tripID);
  }
}
