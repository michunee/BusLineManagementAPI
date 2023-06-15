import { BadRequestException, Injectable } from '@nestjs/common';
import { ORDER_BY_DESC, ROLE_ID } from 'src/base/constants';
import { validateRole } from 'src/base/service';
import { Person } from 'src/entities/person';
import { Trip } from 'src/entities/trip';
import { GetTripsCommand } from './command/getTrips.command';
import { TripInput } from './model';
import { Brackets } from 'typeorm';
import { GetDriverCommand } from '../driver/command/getDriver.command';

@Injectable()
export class TripService {
  async getTrips(
    startProvinceID?: number,
    endProvinceID?: number,
    tripDate?: string,
    page?: number,
    IsForUser?: number,
    month?: number,
    year?: number,
  ) {
    const builder = Trip.createQueryBuilder()
      .leftJoinAndSelect('Trip.startStation', 'StartStation')
      .leftJoinAndSelect('Trip.endStation', 'EndStation')
      .leftJoinAndSelect('StartStation.province', 'StartProvince')
      .leftJoinAndSelect('EndStation.province', 'EndProvince')
      .leftJoinAndSelect('Trip.bus', 'Bus')
      .leftJoinAndSelect('Bus.busType', 'BusType')
      .leftJoinAndSelect('Trip.tickets', 'Ticket')
      .leftJoinAndSelect('Ticket.busSeats', 'BusSeat');

    if (startProvinceID && endProvinceID && tripDate) {
      builder
        .where('StartProvince.ID = :startProvinceID', { startProvinceID })
        .andWhere('EndProvince.ID = :endProvinceID', { endProvinceID })
        .andWhere('CAST(Trip.DepartDate AS varchar) LIKE :tripDate', {
          tripDate: `%${tripDate}%`,
        });
    }

    if (IsForUser) {
      builder.andWhere('Trip.IsCompleted = :IsCompleted', {
        IsCompleted: false,
      });
    }

    if (month) {
      builder.andWhere('EXTRACT(MONTH FROM Trip.DepartDate) = :month', {
        month,
      });
    }

    if (year) {
      builder.andWhere('EXTRACT(YEAR FROM Trip.DepartDate) = :year', {
        year,
      });
    }

    if (page) {
      builder.skip((page - 1) * 6).take(6);
    }

    builder
      .orderBy('Trip.DepartDate', ORDER_BY_DESC)
      .addOrderBy('Trip.ID', ORDER_BY_DESC);

    const [data, total] = await builder.getManyAndCount();

    return {
      data,
      total,
    };
  }

  async changeTripCancelledStatus(
    input: { TripID: number; IsCancelled: boolean },
    currentPerson: Person,
  ) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);
    const { TripID, IsCancelled } = input;
    await Trip.update({ ID: TripID }, { IsCancelled });
    return { message: 'Change trip cancelled status successfully!' };
  }

  async changeTripCompletedStatus(
    input: { TripID: number; IsCompleted: boolean },
    currentPerson: Person,
  ) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);
    const { TripID, IsCompleted } = input;
    await Trip.update({ ID: TripID }, { IsCompleted });
    return { message: 'Change trip completed status successfully!' };
  }

  async getTrip(ID: number) {
    return await GetTripsCommand.getByID(ID);
  }

  async insertTrip(input: TripInput, currentPerson: Person) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);

    const {
      StartStationID,
      EndStationID,
      DepartDate,
      FinishDate,
      Price,
      BusID,
      DriverID,
    } = input;

    if (StartStationID === EndStationID) {
      throw new BadRequestException(
        'Start station must be different from end station!',
      );
    }

    if (!DepartDate) {
      throw new BadRequestException('Depart date is required!');
    }

    if (new Date(DepartDate) < new Date()) {
      throw new BadRequestException(
        'Depart date must be greater than current date!',
      );
    }

    if (!FinishDate) {
      throw new BadRequestException('Finish date is required!');
    }

    if (new Date(FinishDate) < new Date()) {
      throw new BadRequestException(
        'Finish date must be greater than current date!',
      );
    }

    if (new Date(DepartDate) >= new Date(FinishDate)) {
      throw new BadRequestException(
        'Finish date must be greater than depart date!',
      );
    }

    if (!Price) {
      throw new BadRequestException('Price must be greater than 0!');
    }

    if (isNaN(Price)) {
      throw new BadRequestException('Price must be a number!');
    }

    const existBus = await Trip.getRepository()
      .createQueryBuilder()
      .leftJoinAndSelect('Trip.bus', 'Bus')
      .where('Bus.ID = :ID', { ID: BusID })
      .andWhere('Bus.IsActive = :IsActive', { IsActive: true })
      .andWhere('Trip.IsCompleted = :IsCompleted', { IsCompleted: false })
      .andWhere('Trip.IsCancelled = :IsCancelled', { IsCancelled: false })
      .andWhere(
        new Brackets((qb) => {
          qb.where(':DepartDate BETWEEN Trip.DepartDate AND Trip.FinishDate', {
            DepartDate: new Date(DepartDate),
          })
            .orWhere(
              ':FinishDate BETWEEN Trip.DepartDate AND Trip.FinishDate',
              { FinishDate: new Date(FinishDate) },
            )
            .orWhere('Trip.DepartDate BETWEEN :DepartDate AND :FinishDate', {
              DepartDate: new Date(DepartDate),
              FinishDate: new Date(FinishDate),
            })
            .orWhere('Trip.FinishDate BETWEEN :DepartDate AND :FinishDate', {
              DepartDate: new Date(DepartDate),
              FinishDate: new Date(FinishDate),
            });
        }),
      )
      .getMany();

    const existDriver = await Trip.getRepository()
      .createQueryBuilder()
      .leftJoinAndSelect('Trip.driver', 'Driver')
      .where('Driver.ID = :ID', { ID: DriverID })
      .andWhere('Driver.IsActive = :IsActive', { IsActive: true })
      .andWhere('Trip.IsCompleted = :IsCompleted', { IsCompleted: false })
      .andWhere('Trip.IsCancelled = :IsCancelled', { IsCancelled: false })
      .andWhere(
        new Brackets((qb) => {
          qb.where(':DepartDate BETWEEN Trip.DepartDate AND Trip.FinishDate', {
            DepartDate: new Date(DepartDate),
          })
            .orWhere(
              ':FinishDate BETWEEN Trip.DepartDate AND Trip.FinishDate',
              { FinishDate: new Date(FinishDate) },
            )
            .orWhere('Trip.DepartDate BETWEEN :DepartDate AND :FinishDate', {
              DepartDate: new Date(DepartDate),
              FinishDate: new Date(FinishDate),
            })
            .orWhere('Trip.FinishDate BETWEEN :DepartDate AND :FinishDate', {
              DepartDate: new Date(DepartDate),
              FinishDate: new Date(FinishDate),
            });
        }),
      )
      .getMany();

    if (existBus.length > 0) {
      throw new BadRequestException('This bus is not available at this time!');
    }

    const driver = await GetDriverCommand.getByID(DriverID);

    if (new Date(driver.LicenseExpiredDate) < new Date(DepartDate)) {
      throw new BadRequestException(
        'This driver license is expired at this depart time!',
      );
    }

    if (new Date(driver.LicenseDate) > new Date(DepartDate)) {
      throw new BadRequestException(
        'This driver license is not available at this depart time!',
      );
    }

    if (existDriver.length > 0) {
      throw new BadRequestException(
        'This driver is not available at this time!',
      );
    }

    const trip = Trip.create({
      StartStationID,
      EndStationID,
      DepartDate,
      FinishDate,
      Price,
      BusID,
      DriverID,
    });

    await Trip.save(trip);
  }

  async updateTrip(input: TripInput, currentPerson: Person) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);

    const { TripID, DepartDate, FinishDate, Price, BusID, DriverID } = input;

    if (!DepartDate) {
      throw new BadRequestException('Depart date is required!');
    }

    if (new Date(DepartDate) < new Date()) {
      throw new BadRequestException(
        'Depart date must be greater than current date!',
      );
    }

    if (!FinishDate) {
      throw new BadRequestException('Finish date is required!');
    }

    if (new Date(FinishDate) < new Date()) {
      throw new BadRequestException(
        'Finish date must be greater than current date!',
      );
    }

    if (new Date(DepartDate) >= new Date(FinishDate)) {
      throw new BadRequestException(
        'Finish date must be greater than depart date!',
      );
    }

    if (!Price) {
      throw new BadRequestException('Price must be greater than 0!');
    }

    if (isNaN(Price)) {
      throw new BadRequestException('Price must be a number!');
    }

    const existBus = await Trip.getRepository()
      .createQueryBuilder()
      .leftJoinAndSelect('Trip.bus', 'Bus')
      .where('Bus.ID = :ID', { ID: BusID })
      .andWhere('Trip.IsCompleted = :IsCompleted', { IsCompleted: false })
      .andWhere('Trip.IsCancelled = :IsCancelled', { IsCancelled: false })
      .andWhere(`Trip.ID != :TripID`, { TripID })
      .andWhere(
        new Brackets((qb) => {
          qb.where(':DepartDate BETWEEN Trip.DepartDate AND Trip.FinishDate', {
            DepartDate: new Date(DepartDate),
          })
            .orWhere(
              ':FinishDate BETWEEN Trip.DepartDate AND Trip.FinishDate',
              { FinishDate: new Date(FinishDate) },
            )
            .orWhere('Trip.DepartDate BETWEEN :DepartDate AND :FinishDate', {
              DepartDate: new Date(DepartDate),
              FinishDate: new Date(FinishDate),
            })
            .orWhere('Trip.FinishDate BETWEEN :DepartDate AND :FinishDate', {
              DepartDate: new Date(DepartDate),
              FinishDate: new Date(FinishDate),
            });
        }),
      )
      .getMany();

    const existDriver = await Trip.getRepository()
      .createQueryBuilder()
      .leftJoinAndSelect('Trip.driver', 'Driver')
      .where('Driver.ID = :ID', { ID: DriverID })
      .andWhere('Trip.IsCompleted = :IsCompleted', { IsCompleted: false })
      .andWhere('Trip.IsCancelled = :IsCancelled', { IsCancelled: false })
      .andWhere(`Trip.ID != :TripID`, { TripID })
      .andWhere(
        new Brackets((qb) => {
          qb.where(':DepartDate BETWEEN Trip.DepartDate AND Trip.FinishDate', {
            DepartDate: new Date(DepartDate),
          })
            .orWhere(
              ':FinishDate BETWEEN Trip.DepartDate AND Trip.FinishDate',
              { FinishDate: new Date(FinishDate) },
            )
            .orWhere('Trip.DepartDate BETWEEN :DepartDate AND :FinishDate', {
              DepartDate: new Date(DepartDate),
              FinishDate: new Date(FinishDate),
            })
            .orWhere('Trip.FinishDate BETWEEN :DepartDate AND :FinishDate', {
              DepartDate: new Date(DepartDate),
              FinishDate: new Date(FinishDate),
            });
        }),
      )
      .getMany();

    if (existBus.length > 0) {
      throw new BadRequestException('This bus is not available at this time!');
    }

    const driver = await GetDriverCommand.getByID(DriverID);

    if (new Date(driver.LicenseExpiredDate) < new Date(DepartDate)) {
      throw new BadRequestException(
        'This driver license is expired at this depart time!',
      );
    }

    if (new Date(driver.LicenseDate) > new Date(DepartDate)) {
      throw new BadRequestException(
        'This driver license is not available at this depart time!',
      );
    }

    if (existDriver.length > 0) {
      throw new BadRequestException(
        'This driver is not available at this time!',
      );
    }

    await Trip.update(
      { ID: TripID },
      { DepartDate, FinishDate, Price, BusID, DriverID },
    );

    return { message: 'Update trip successfully!' };
  }
}
