import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from 'src/entities/passenger';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger])],
})
export class PassengerModule {}
