import { ORDER_BY_ASC } from 'src/base/constants';
import { Province } from 'src/entities/province';

export class GetProvinceCommand {
  static async get() {
    return Province.createQueryBuilder()
      .leftJoinAndSelect('Province.stations', 'Station')
      .orderBy('Province.ID', ORDER_BY_ASC)
      .addOrderBy('Station.ID', ORDER_BY_ASC)
      .getMany();
  }
}
