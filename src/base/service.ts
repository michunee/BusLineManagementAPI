import { Person } from 'src/entities/person';
import { BadRequestException } from '@nestjs/common';

export function validateRole(person: Person, RoleIDs: number[]) {
  if (!RoleIDs.includes(person.RoleID)) {
    throw new BadRequestException('You are not allowed to do this!');
  }
}
