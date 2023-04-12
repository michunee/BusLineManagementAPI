import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusSeat } from 'src/entities/busSeat';

@Module({
  imports: [TypeOrmModule.forFeature([BusSeat])],
})
export class BusSeatModule {}
