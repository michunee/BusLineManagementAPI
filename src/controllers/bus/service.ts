import { BadRequestException, Injectable } from '@nestjs/common';
import { ORDER_BY_ASC, ROLE_ID } from 'src/base/constants';
import { validateRole } from 'src/base/service';
import { Bus } from 'src/entities/bus';
import { Person } from 'src/entities/person';
import { BusInput } from './model';
import { Brackets } from 'typeorm';

@Injectable()
export class BusService {
  async getBuses(currentPerson: Person, filter: string, busTypeID: number) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);

    const builder = Bus.createQueryBuilder()
      .orderBy('Bus.BusTypeID', ORDER_BY_ASC)
      .addOrderBy('Bus.RegNo', ORDER_BY_ASC);

    if (filter) {
      builder.andWhere(
        new Brackets((qb) => {
          qb.where('Bus.Name ILIKE :filter', { filter: `%${filter}%` }).orWhere(
            'Bus.RegNo ILIKE :filter',
            { filter: `%${filter}%` },
          );
        }),
      );
    }

    if (busTypeID) {
      builder.andWhere('Bus.BusTypeID = :busTypeID', { busTypeID });
    }

    return await builder.getMany();
  }

  async getActiveBuses(currentPerson: Person) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);
    return Bus.getRepository()
      .createQueryBuilder()
      .where('Bus.IsActive = :isActive', { isActive: true })
      .orderBy('Bus.BusTypeID', ORDER_BY_ASC)
      .addOrderBy('Bus.ID', ORDER_BY_ASC)
      .getMany();
  }

  async changeBusStatus(
    input: { BusID: number; IsActive: boolean },
    currentPerson: Person,
  ) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);
    const { BusID, IsActive } = input;

    await Bus.update({ ID: BusID }, { IsActive });

    return { message: 'Change bus status successfully!' };
  }

  async insertBus(input: BusInput, currentPerson: Person) {
    const { Name, RegNo, BusTypeID, Note, ImageUrl } = input;
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);

    if (!Name) {
      throw new BadRequestException('Please enter bus name!');
    }
    if (!RegNo) {
      throw new BadRequestException('Please enter bus registration number!');
    }
    if (RegNo.length > 10) {
      throw new BadRequestException(
        'Registration number must be less than 10 characters!',
      );
    }

    const bus = Bus.create({
      Name,
      RegNo,
      BusTypeID,
      Note,
      ImageUrl,
    });

    await Bus.save(bus);

    return {
      ...bus,
      AddedDate: bus.AddedDate.toLocaleString(),
    };
  }

  async updateBus(input: BusInput, currentPerson: Person) {
    const { ID, Name, RegNo, BusTypeID, Note, ImageUrl } = input;
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);

    if (!ID) {
      throw new BadRequestException('Please enter bus ID!');
    }
    if (!Name) {
      throw new BadRequestException('Bus name is required!');
    }
    if (!RegNo) {
      throw new BadRequestException('Bus registration number is required!');
    }
    if (RegNo.length > 10) {
      throw new BadRequestException(
        'Registration number must be less than 10 characters!',
      );
    }

    await Bus.update(
      { ID },
      {
        Name,
        RegNo,
        BusTypeID,
        Note,
        ImageUrl,
      },
    );

    return { message: 'Update bus successfully!' };
  }
}
