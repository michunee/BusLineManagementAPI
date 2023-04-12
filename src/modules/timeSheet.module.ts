import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSheet } from 'src/entities/timeSheet';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSheet])],
})
export class TimeSheetModule {}
