import { IsIn } from 'class-validator';
import { GENDER } from 'src/base/constants';

export class DriverInput {
  ID?: number;

  Name: string;

  @IsIn(Object.values(GENDER))
  Gender: string;

  Phonenumber: string;

  LicenseNo: string;

  CardID: string;

  LicenseDate: Date;

  LicenseExpiredDate: Date;

  LicenseClass: string;

  Address: string;

  Note?: string;
}
