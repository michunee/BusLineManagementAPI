import { Person } from 'src/entities/person';
import {
  PersonChangePasswordInput,
  PersonInput,
  PersonUpdateInput,
} from './model';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GetPersonCommand } from './command/getPerson.command';
import { JwtService } from '@nestjs/jwt';
import { ORDER_BY_ASC, ORDER_BY_DESC, ROLE_ID } from 'src/base/constants';
import { validateRole } from 'src/base/service';
import { Brackets } from 'typeorm';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class PersonService {
  constructor(
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async signUp(input: PersonInput) {
    const {
      Name,
      Email,
      Password,
      ConfirmPassword,
      Gender,
      DateOfBirth,
      CardID,
      Address,
      Phonenumber,
      Note,
    } = input;

    const person = await Person.findOne({ where: { Email } });

    if (!Name) {
      throw new BadRequestException('Please enter name!');
    }
    if (!Email) {
      throw new BadRequestException('Please enter email!');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(Email)) {
      throw new BadRequestException('Email is invalid!');
    }
    if (person) {
      throw new BadRequestException('Email already exists!');
    }
    if (!Password) {
      throw new BadRequestException('Please enter password!');
    }
    if (Password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters!');
    }
    if (!ConfirmPassword) {
      throw new BadRequestException('Please enter confirm password!');
    }
    if (Password !== ConfirmPassword) {
      throw new BadRequestException('Confirm password does not match!');
    }
    if (DateOfBirth == null) {
      throw new BadRequestException('Please enter date of birth!');
    }
    if (!CardID) {
      throw new BadRequestException('Please enter card ID!');
    }
    if (isNaN(Number(CardID))) {
      throw new BadRequestException('Invalid cardID!');
    }
    if (CardID.length != 12) {
      throw new BadRequestException('Card ID must be 12 digits!');
    }
    if (!Phonenumber) {
      throw new BadRequestException('Please enter phone number!');
    }
    if (isNaN(Number(Phonenumber))) {
      throw new BadRequestException('Invalid phone number!');
    }
    if (Phonenumber.length != 10) {
      throw new BadRequestException('Phone number must be 10 digits!');
    }
    if (!Address) {
      throw new BadRequestException('Please enter address!');
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const newPerson = Person.create({
      Name,
      Email,
      Password: hashedPassword,
      Gender,
      DateOfBirth,
      CardID,
      Address,
      Phonenumber,
      Note,
      RoleID: ROLE_ID.User,
    });

    await Person.save(newPerson);

    await this.mailerService.sendMail({
      to: Email,
      subject: 'Welcome to TravelBus',
      template: 'src/templates/email/welcome',
      context: {
        name: Name,
        email: Email,
        apiDomain: process.env.API_DOMAIN,
      },
    });

    return {
      ...newPerson,
      AddedDate: newPerson.AddedDate.toLocaleString(),
    };
  }

  async insertPerson(input: PersonInput, currentPerson: Person) {
    const {
      Name,
      Email,
      Password,
      ConfirmPassword,
      Gender,
      DateOfBirth,
      CardID,
      Address,
      Phonenumber,
      Note,
    } = input;

    validateRole(currentPerson, [ROLE_ID.SuperAdmin]);

    const person = await Person.findOne({ where: { Email } });

    if (!Name) {
      throw new BadRequestException('Please enter name!');
    }
    if (!Email) {
      throw new BadRequestException('Please enter email!');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(Email)) {
      throw new BadRequestException('Email is invalid!');
    }
    if (person) {
      throw new BadRequestException('Email already exists!');
    }
    if (!Password) {
      throw new BadRequestException('Please enter password!');
    }
    if (Password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters!');
    }
    if (!ConfirmPassword) {
      throw new BadRequestException('Please enter confirm password!');
    }
    if (Password !== ConfirmPassword) {
      throw new BadRequestException('Confirm password does not match!');
    }
    if (!CardID) {
      throw new BadRequestException('Please enter card ID!');
    }
    if (isNaN(Number(CardID))) {
      throw new BadRequestException('Invalid cardID!');
    }
    if (CardID.length != 12) {
      throw new BadRequestException('Card ID must be 12 digits!');
    }
    if (!Phonenumber) {
      throw new BadRequestException('Please enter phone number!');
    }
    if (isNaN(Number(Phonenumber))) {
      throw new BadRequestException('Invalid phone number!');
    }
    if (Phonenumber.length != 10) {
      throw new BadRequestException('Phone number must be 10 digits!');
    }
    if (DateOfBirth == null) {
      throw new BadRequestException('Please enter date of birth!');
    }
    if (!Address) {
      throw new BadRequestException('Please enter address!');
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const newPerson = Person.create({
      Name,
      Email,
      Password: hashedPassword,
      Gender,
      DateOfBirth,
      CardID,
      Address,
      Phonenumber,
      Note,
      RoleID: ROLE_ID.Admin,
      IsVerify: true,
    });

    await Person.save(newPerson);
    return {
      ...newPerson,
      AddedDate: newPerson.AddedDate.toLocaleString(),
    };
  }

  async signIn(input: { Email: string; Password: string }, res: any) {
    const { Email, Password } = input;
    if (!Email) {
      throw new BadRequestException('Please enter your email!');
    }

    if (!Password) {
      throw new BadRequestException('Please enter your password!');
    }

    const person = await GetPersonCommand.getByEmail(Email);

    const comparedPassword = await bcrypt.compare(Password, person.Password);
    if (!comparedPassword) {
      throw new BadRequestException('Password is incorrect, please try again!');
    }

    if (!person.IsVerify) {
      throw new BadRequestException(
        'Your account is not verified, please check your email to verify!',
      );
    }

    if (!person.IsActive) {
      throw new BadRequestException(
        'Your account is not active, please check your email for more infomaion!',
      );
    }

    const payload = {
      ID: person.ID,
      Email: person.Email,
      RoleID: person.RoleID,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    res.cookie('accessToken', accessToken, { httpOnly: true });

    return { person, accessToken };
  }

  async signout(res: any) {
    res.cookie('accessToken', null, { httpOnly: true });
    return { message: 'Sign out successfully!' };
  }

  async getPersons(currentPerson: Person, filter: string) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);

    const builder = Person.createQueryBuilder()
      .orderBy('Person.Name', ORDER_BY_ASC)
      .addOrderBy('Person.ID', ORDER_BY_DESC);

    if (filter) {
      builder.andWhere(
        new Brackets((qb) => {
          qb.where('Person.Name ilike :filter', {
            filter: `%${filter}%`,
          }).orWhere('Person.Email ilike :filter', {
            filter: `%${filter}%`,
          });
        }),
      );
    }

    return await builder.getMany();
  }

  async changePersonStatus(
    input: { PersonID: number; IsActive: boolean },
    currentPerson: Person,
  ) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);
    const { PersonID, IsActive } = input;
    if (PersonID == currentPerson.ID) {
      throw new BadRequestException('You cannot action on yourself!');
    }

    await Person.update({ ID: PersonID }, { IsActive });

    const person = await GetPersonCommand.getByID(PersonID);

    if (!IsActive) {
      await this.mailerService.sendMail({
        to: person.Email,
        subject: 'TravelBus account status notification',
        template: 'src/templates/email/status',
        context: {
          name: person.Name,
          email: person.Email,
        },
      });
    }

    return { message: 'Change user status successfully!' };
  }

  async changePersonRole(
    input: { PersonID: number; RoleID: number },
    currentPerson: Person,
  ) {
    validateRole(currentPerson, [ROLE_ID.Admin, ROLE_ID.SuperAdmin]);
    const { PersonID, RoleID } = input;
    if (PersonID == currentPerson.ID) {
      throw new BadRequestException('You cannot action on yourself!');
    }
    await Person.update({ ID: PersonID }, { RoleID });

    return { message: 'Change user role successfully!' };
  }

  async getPerson(PersonID: number) {
    return await GetPersonCommand.getByID(PersonID);
  }

  async changePassword(
    input: {
      CurrentPassword: string;
      NewPassword: string;
      ConfirmPassword: string;
    },
    currentPerson: Person,
  ) {
    const { CurrentPassword, NewPassword, ConfirmPassword } = input;
    if (!CurrentPassword) {
      throw new BadRequestException('Please enter current password!');
    }
    const person = await GetPersonCommand.getByID(currentPerson.ID);
    const comparedPassword = await bcrypt.compare(
      CurrentPassword,
      person.Password,
    );
    if (!comparedPassword) {
      throw new BadRequestException('Current password is incorrect!');
    }
    if (!NewPassword) {
      throw new BadRequestException('Please enter new password!');
    }
    if (NewPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters!');
    }
    if (!ConfirmPassword) {
      throw new BadRequestException('Please enter confirm password!');
    }
    if (NewPassword !== ConfirmPassword) {
      throw new BadRequestException('Confirm password does not match!');
    }

    const hashedPassword = await bcrypt.hash(NewPassword, 10);
    await Person.update({ ID: currentPerson.ID }, { Password: hashedPassword });

    return { message: 'Change password successfully!' };
  }

  async updatePerson(input: PersonUpdateInput, currentPerson: Person) {
    const { Name, Gender, DateOfBirth, CardID, Phonenumber, Address, Note } =
      input;
    if (!Name) {
      throw new BadRequestException('Name is required!');
    }
    if (!CardID) {
      throw new BadRequestException('CardID is required!');
    }
    if (isNaN(Number(CardID))) {
      throw new BadRequestException('Invalid cardID!');
    }
    if (CardID.length != 12) {
      throw new BadRequestException('Card ID must be 12 digits!');
    }
    if (!Phonenumber) {
      throw new BadRequestException('Phonenumber is required!');
    }
    if (!DateOfBirth) {
      throw new BadRequestException('Date of birth is required!');
    }
    if (isNaN(Number(Phonenumber))) {
      throw new BadRequestException('Invalid phone number!');
    }
    if (Phonenumber.length != 10) {
      throw new BadRequestException('Phone number must be 10 digits!');
    }
    if (!Address) {
      throw new BadRequestException('Address is required!');
    }

    await Person.update(
      { ID: currentPerson.ID },
      {
        Name,
        Gender,
        DateOfBirth,
        CardID,
        Phonenumber,
        Address,
        Note,
      },
    );

    return { message: 'Update profile successfully!' };
  }

  async verifyEmail(res: any, email: string) {
    const person = await GetPersonCommand.getByEmail(email);
    person.IsVerify = true;
    await Person.save(person);

    res.redirect(`${process.env.WEB_DOMAIN}`);
  }

  async forgotPassword(body: { Email: string }) {
    const { Email } = body;
    if (!Email) {
      throw new BadRequestException('Please enter your email!');
    }
    const person = await Person.findOne({ where: { Email } });
    if (!person) {
      throw new NotFoundException(`This email does not exist in system!`);
    }
    const hashedEmail = await bcrypt.hash(Email, 10);
    await this.mailerService.sendMail({
      to: person.Email,
      subject: 'TravelBus account change password',
      template: 'src/templates/email/changePassword',
      context: {
        name: person.Name,
        email: person.Email,
        hashedEmail,
        apiDomain: process.env.API_DOMAIN,
        hashedPassword: person.Password,
      },
    });
  }

  async getChangePasswordLink(email: string, password: string, res: any) {
    res.redirect(
      `${process.env.WEB_DOMAIN}/change-password/${email.replace(
        /\//g,
        '-',
      )}/${password.replace(/\//g, '-')}`,
    );
  }

  async changeForgotPassword(input: PersonChangePasswordInput) {
    const { Email, Password, ConfirmPassword, HashedEmail, HashedPassword } =
      input;

    const newHashedEmail = HashedEmail.replace(/-/g, '/');
    const newHashedPassword = HashedPassword.replace(/-/g, '/');

    if (!Email) {
      throw new BadRequestException('Please enter your email!');
    }
    const person = await Person.findOne({ where: { Email } });
    if (!person) {
      throw new NotFoundException(`This email does not exist in system!`);
    }
    if (!Password) {
      throw new BadRequestException('Please enter your new password!');
    }
    if (Password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters!');
    }
    if (!ConfirmPassword) {
      throw new BadRequestException('Please enter confirm password!');
    }
    if (Password !== ConfirmPassword) {
      throw new BadRequestException('Confirm password does not match!');
    }

    const comparedEmail = await bcrypt.compare(Email, newHashedEmail);
    if (!comparedEmail) {
      throw new BadRequestException(
        'Email is not verify to change password, please try again!',
      );
    }

    if (newHashedPassword !== person.Password) {
      throw new BadRequestException('This link is expired, please try again!');
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    await Person.update({ ID: person.ID }, { Password: hashedPassword });

    return { message: 'Change forgot password successfully!' };
  }
}
