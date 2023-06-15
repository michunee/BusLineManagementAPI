import { BadRequestException, Injectable } from '@nestjs/common';
import { ORDER_BY_ASC, ROLE_ID } from 'src/base/constants';
import { validateRole } from 'src/base/service';
import { Person } from 'src/entities/person';
import { Station } from 'src/entities/station';
import { Brackets } from 'typeorm';
import { StationInput } from './model';

@Injectable()
export class StationService {
  async getStations(ProvinceID: number, filter: string, IsActive: boolean) {
    const builder = Station.getRepository()
      .createQueryBuilder()
      .leftJoinAndSelect('Station.province', 'Province');
    if (ProvinceID) {
      builder.where('Station.ProvinceID = :ProvinceID', { ProvinceID });
    }
    if (filter) {
      builder.andWhere(
        new Brackets((qb) => {
          qb.where('Station.Name ILIKE :filter', {
            filter: `%${filter}%`,
          }).orWhere('Station.Address ILIKE :filter', {
            filter: `%${filter}%`,
          });
        }),
      );
    }

    if (IsActive) {
      builder.andWhere('Station.IsActive = :IsActive', { IsActive });
    }

    return builder
      .orderBy('Province.ID', ORDER_BY_ASC)
      .addOrderBy('Station.Name', ORDER_BY_ASC)
      .getMany();
  }

  async changeStationStatus(
    input: { StationID: number; IsActive: boolean },
    currentPerson: Person,
  ) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);
    const { StationID, IsActive } = input;

    await Station.update({ ID: StationID }, { IsActive });

    return { message: 'Change station status successfully!' };
  }

  async insertStation(input: StationInput, currentPerson: Person) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);
    const { Name, Address, ProvinceID } = input;

    if (!Name) {
      throw new BadRequestException('Please enter station name!');
    }

    if (!Address) {
      throw new BadRequestException('Please enter station address!');
    }

    if (!ProvinceID) {
      throw new BadRequestException('Please select province!');
    }

    const station = Station.create({
      ...input,
    });

    return Station.save(station);
  }

  async updateStation(input: StationInput, currentPerson: Person) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);
    const { ID, Name, Address, Note } = input;

    if (!Name) {
      throw new BadRequestException('Station name is required!');
    }

    if (!Address) {
      throw new BadRequestException('Station address is required!');
    }

    await Station.update(
      { ID },
      {
        Name,
        Address,
        Note,
      },
    );

    return { message: 'Update station successfully!' };
  }
}
