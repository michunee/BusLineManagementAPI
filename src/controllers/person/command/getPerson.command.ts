import { NotFoundException } from '@nestjs/common';
import { Person } from 'src/entities/person';

export class GetPersonCommand {
  static async getByID(ID: number) {
    const person = await Person.findOne({ where: { ID } });
    if (!person) {
      throw new NotFoundException(`Person with ID ${ID} not found!`);
    }
    return person;
  }

  static async getByEmail(Email: string) {
    const person = await Person.findOne({ where: { Email } });
    if (!person) {
      throw new NotFoundException(`User with email ${Email} does not exist!`);
    }
    return person;
  }
}
