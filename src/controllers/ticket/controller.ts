import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './service';
import { AuthGuard } from '@nestjs/passport';
import { TicketInput } from './model';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Person } from 'src/entities/person';

@Controller('/ticket')
export class TicketController {
  constructor(private service: TicketService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  public getTickets(
    @Query('tripID') tripID: number,
    @Query('personID') personID: number,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.service.getTickets(tripID, personID, month, year);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public getTicket(@Param('id') ID: string) {
    return this.service.getTicket(Number(ID));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  public insertTicket(
    @Body() input: TicketInput,
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.insertTicket(input, currentPerson);
  }
}
