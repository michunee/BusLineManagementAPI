import { Trip } from 'src/entities/trip';

export class GetTripsCommand {
  static async getByID(ID: number) {
    const trip = await Trip.getRepository()
      .createQueryBuilder()
      .leftJoinAndSelect('Trip.startStation', 'StartStation')
      .leftJoinAndSelect('Trip.endStation', 'EndStation')
      .leftJoinAndSelect('StartStation.province', 'StartProvince')
      .leftJoinAndSelect('EndStation.province', 'EndProvince')
      .leftJoinAndSelect('Trip.bus', 'Bus')
      .leftJoinAndSelect('Trip.driver', 'Driver')
      .leftJoinAndSelect('Bus.busType', 'BusType')
      .leftJoinAndSelect('BusType.busSeats', 'BusSeat')
      .where('Trip.ID = :ID', { ID })
      .getOne();

    if (!trip) throw new Error(`Trip ID ${ID} is not found!`);
    return trip;
  }
}
