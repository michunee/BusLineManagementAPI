import { BadRequestException, Injectable } from '@nestjs/common';
import { ORDER_BY_ASC, ORDER_BY_DESC, ROLE_ID } from 'src/base/constants';
import { validateRole } from 'src/base/service';
import { Person } from 'src/entities/person';
import { Driver } from 'src/entities/driver';
import { DriverInput } from './model';
import { Brackets } from 'typeorm';

@Injectable()
export class DriverService {
  async getDrivers(currentPerson: Person, filter: string) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);

    const builder = Driver.createQueryBuilder()
      .orderBy('Driver.Name', ORDER_BY_ASC)
      .addOrderBy('Driver.ID', ORDER_BY_DESC);

    if (filter) {
      builder.andWhere(
        new Brackets((qb) => {
          qb.where('Driver.Name ILIKE :filter', {
            filter: `%${filter}%`,
          }).orWhere('Driver.LicenseNo ILIKE :filter', {
            filter: `%${filter}%`,
          });
        }),
      );
    }

    return await builder.getMany();
  }

  async getActiveDrivers(currentPerson: Person) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);

    return Driver.getRepository()
      .createQueryBuilder()
      .where('Driver.IsActive = :isActive', { isActive: true })
      .orderBy('Driver.Name', ORDER_BY_ASC)
      .addOrderBy('Driver.ID', ORDER_BY_ASC)
      .getMany();
  }

  async changeDriverStatus(
    input: { DriverID: number; IsActive: boolean },
    currentPerson: Person,
  ) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);
    const { DriverID, IsActive } = input;

    await Driver.update({ ID: DriverID }, { IsActive });

    return { message: 'Change driver status successfully!' };
  }

  async insertDriver(input: DriverInput, currentPerson: Person) {
    const {
      Name,
      CardID,
      Phonenumber,
      LicenseNo,
      LicenseDate,
      LicenseExpiredDate,
      LicenseClass,
      Address,
    } = input;
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);
    if (!Name) {
      throw new BadRequestException('Please enter driver name!');
    }
    if (!CardID) {
      throw new BadRequestException('Please enter driver card ID!');
    }
    if (isNaN(Number(CardID))) {
      throw new BadRequestException('Invalid card ID!');
    }
    if (CardID.length != 12) {
      throw new BadRequestException('Card ID must be 12 digits!');
    }
    if (!Phonenumber) {
      throw new BadRequestException('Please enter driver phone number!');
    }
    if (isNaN(Number(Phonenumber))) {
      throw new BadRequestException('Invalid phone number!');
    }
    if (Phonenumber.length != 10) {
      throw new BadRequestException('Phone number must be 10 digits!');
    }
    if (!LicenseNo) {
      throw new BadRequestException('Please enter driver license number!');
    }
    if (isNaN(Number(LicenseNo))) {
      throw new BadRequestException('Invalid license number!');
    }
    if (LicenseNo.length != 10) {
      throw new BadRequestException('License number must be 10 digits!');
    }
    if (!LicenseDate) {
      throw new BadRequestException('Please choose driver license date!');
    }
    if (!LicenseExpiredDate) {
      throw new BadRequestException(
        'Please choose driver license expired date!',
      );
    }
    if (new Date(LicenseDate) > new Date(LicenseExpiredDate)) {
      throw new BadRequestException(
        'License date must be less than license expired date!',
      );
    }
    if (!LicenseClass) {
      throw new BadRequestException('Please choose driver license class!');
    }
    if (LicenseClass.length > 5) {
      throw new BadRequestException(
        'License class must be less than 5 characters!',
      );
    }
    if (!Address) {
      throw new BadRequestException('Please enter driver address!');
    }
    const driver = Driver.create({ ...input });
    await Driver.save(driver);

    return {
      ...driver,
      AddedDate: driver.AddedDate.toLocaleString(),
    };
  }

  async updateDriver(input: DriverInput, currentPerson: Person) {
    const {
      ID,
      Name,
      CardID,
      Gender,
      Phonenumber,
      LicenseNo,
      LicenseDate,
      LicenseExpiredDate,
      LicenseClass,
      Address,
      Note,
    } = input;

    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);

    if (!Name) {
      throw new BadRequestException('Name is required!');
    }
    if (!CardID) {
      throw new BadRequestException('Card ID is required!');
    }
    if (isNaN(Number(CardID))) {
      throw new BadRequestException('Invalid card ID!');
    }
    if (CardID.length != 12) {
      throw new BadRequestException('Card ID must be 12 digits!');
    }
    if (!Phonenumber) {
      throw new BadRequestException('Phone number is required!');
    }
    if (isNaN(Number(Phonenumber))) {
      throw new BadRequestException('Invalid phone number!');
    }
    if (Phonenumber.length != 10) {
      throw new BadRequestException('Phone number must be 10 digits!');
    }
    if (!LicenseNo) {
      throw new BadRequestException('License number is required!');
    }
    if (isNaN(Number(LicenseNo))) {
      throw new BadRequestException('Invalid license number!');
    }
    if (LicenseNo.length != 10) {
      throw new BadRequestException('License number must be 10 digits!');
    }
    if (!LicenseDate) {
      throw new BadRequestException('Please choose driver license date!');
    }
    if (!LicenseExpiredDate) {
      throw new BadRequestException(
        'Please choose driver license expired date!',
      );
    }
    if (new Date(LicenseDate) > new Date(LicenseExpiredDate)) {
      throw new BadRequestException(
        'License date must be less than license expired date!',
      );
    }
    if (!LicenseClass) {
      throw new BadRequestException('License class is required!');
    }
    if (LicenseClass.length > 5) {
      throw new BadRequestException(
        'License class must be less than 5 characters!',
      );
    }
    if (!Address) {
      throw new BadRequestException('Address is required!');
    }

    await Driver.update(
      { ID },
      {
        Name,
        CardID,
        Gender,
        Phonenumber,
        LicenseNo,
        LicenseDate,
        LicenseExpiredDate,
        LicenseClass,
        Address,
        Note,
      },
    );

    return { message: 'Update driver successfully!' };
  }
}
