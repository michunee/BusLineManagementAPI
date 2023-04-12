import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'src/entities/trip';

@Module({
  imports: [TypeOrmModule.forFeature([Trip])],
})
export class TripModule {}
