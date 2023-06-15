import { Station } from 'src/entities/station';

export class GetStationCommand {
  static async get() {
    return await Station.find();
  }
}
