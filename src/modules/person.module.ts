import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from 'src/entities/person';

@Module({
  imports: [TypeOrmModule.forFeature([Person])],
})
export class PersonModule {}
