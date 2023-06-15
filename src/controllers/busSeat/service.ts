import { Injectable } from '@nestjs/common';
import { BusSeat } from 'src/entities/busSeat';

@Injectable()
export class BusSeatService {
  async getBookedBusSeats(TripID: number) {
    return BusSeat.createQueryBuilder()
      .leftJoin('BusSeat.tickets', 'Ticket')
      .leftJoin('Ticket.trip', 'Trip')
      .where('Trip.ID = :TripID', { TripID })
      .getMany();
  }
}
