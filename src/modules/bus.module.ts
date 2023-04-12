import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bus } from 'src/entities/bus';

@Module({
  imports: [TypeOrmModule.forFeature([Bus])],
})
export class BusModule {}
