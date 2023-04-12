import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusType } from 'src/entities/busType';

@Module({
  imports: [TypeOrmModule.forFeature([BusType])],
})
export class BusTypeModule {}
