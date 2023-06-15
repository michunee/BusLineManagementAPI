import { Driver } from '../../../entities/driver';

export class GetDriverCommand {
  static async getByID(ID: number) {
    return await Driver.findOne({ where: { ID } });
  }
}
