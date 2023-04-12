import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from 'src/entities/station';

@Module({
  imports: [TypeOrmModule.forFeature([Station])],
})
export class StationModule {}
