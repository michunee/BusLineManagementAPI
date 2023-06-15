import { TicketInput } from './model';
import { GetBusSeatCommand } from '../busSeat/command/getBusSeat.command';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Ticket } from 'src/entities/ticket';
import { Person } from 'src/entities/person';
import { ORDER_BY_DESC } from 'src/base/constants';
import { BusSeat } from 'src/entities/busSeat';

@Injectable()
export class TicketService {
  async getTickets(
    tripID: number,
    personID: number,
    month: number,
    year: number,
  ) {
    const builder = Ticket.createQueryBuilder()
      .leftJoinAndSelect('Ticket.busSeats', 'BusSeat')
      .leftJoinAndSelect('Ticket.person', 'Person')
      .leftJoinAndSelect('Ticket.trip', 'Trip')
      .leftJoinAndSelect('Trip.bus', 'Bus')
      .leftJoinAndSelect('Trip.driver', 'Driver')
      .leftJoinAndSelect('Trip.startStation', 'StartStation')
      .leftJoinAndSelect('Trip.endStation', 'EndStation')
      .leftJoinAndSelect('StartStation.province', 'StartProvince')
      .leftJoinAndSelect('EndStation.province', 'EndProvince')
      .orderBy('Ticket.BoughtDate', ORDER_BY_DESC);

    if (personID) {
      builder.andWhere('Ticket.PersonID = :personID', { personID });
    }

    if (tripID) {
      builder.andWhere('Ticket.TripID = :tripID', { tripID });
    }

    if (month) {
      builder.andWhere('EXTRACT(month from Ticket.BoughtDate) = :month', {
        month,
      });
    }

    if (year) {
      builder.andWhere('EXTRACT(year from Ticket.BoughtDate) = :year', {
        year,
      });
    }

    return await builder.getMany();
  }

  public async getTicket(ID: number) {
    return Ticket.createQueryBuilder()
      .leftJoinAndSelect('Ticket.busSeats', 'BusSeat')
      .leftJoinAndSelect('Ticket.trip', 'Trip')
      .leftJoinAndSelect('Trip.bus', 'Bus')
      .leftJoinAndSelect('Trip.startStation', 'StartStation')
      .leftJoinAndSelect('Trip.endStation', 'EndStation')
      .leftJoinAndSelect('Trip.driver', 'Driver')
      .leftJoinAndSelect('StartStation.province', 'StartProvince')
      .leftJoinAndSelect('EndStation.province', 'EndProvince')
      .leftJoinAndSelect('Ticket.person', 'Person')
      .leftJoinAndSelect('Bus.busType', 'BusType')
      .where('Ticket.ID = :ID', { ID })
      .getOne();
  }

  async insertTicket(input: TicketInput, currentUser: Person) {
    const { TripID, BusSeatIDs, TotalPrice } = input;
    if (!BusSeatIDs.length) {
      throw new BadRequestException('Please select at least one seat');
    }
    const bookedBusSeats = await BusSeat.createQueryBuilder()
      .leftJoin('BusSeat.tickets', 'Ticket')
      .leftJoin('Ticket.trip', 'Trip')
      .where('Trip.ID = :TripID', { TripID })
      .getMany();

    const bookedBusSeatsIDs = bookedBusSeats.map((busSeat) => busSeat.ID);
    const isBusSeatBooked = BusSeatIDs.some((busSeatID) =>
      bookedBusSeatsIDs.includes(busSeatID),
    );
    if (isBusSeatBooked) {
      throw new BadRequestException(
        'Some chosen seats are already booked or pending',
      );
    }
    const busSeats = await GetBusSeatCommand.getByIDs(BusSeatIDs);
    const ticket = Ticket.create({
      TripID,
      PersonID: currentUser.ID,
      TotalPrice,
      BoughtDate: new Date(),
      busSeats,
    });

    return Ticket.save(ticket);
  }
}
