import { BusSeat } from 'src/entities/busSeat';

export class GetBusSeatCommand {
  static async getByIDs(IDs: number[]) {
    return BusSeat.createQueryBuilder()
      .where('BusSeat.ID IN (:...IDs)', { IDs })
      .getMany();
  }
}
