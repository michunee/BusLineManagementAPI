import { IsIn } from 'class-validator';
import { GENDER } from 'src/base/constants';

export class PersonInput {
  Name: string;

  Email: string;

  Password: string;

  ConfirmPassword: string;

  @IsIn(Object.values(GENDER))
  Gender: string;

  DateOfBirth: Date;

  CardID: string;

  Address: string;

  Phonenumber: string;

  Note?: string | null;
}

export class PersonUpdateInput {
  Name: string;

  @IsIn(Object.values(GENDER))
  Gender: string;

  DateOfBirth: Date;

  CardID: string;

  Address: string;

  Phonenumber: string;

  Note?: string | null;
}

export class PersonChangePasswordInput {
  Email: string;

  Password: string;

  ConfirmPassword: string;

  HashedEmail: string;

  HashedPassword: string;
}
