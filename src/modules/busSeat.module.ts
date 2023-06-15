import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusSeatController } from 'src/controllers/busSeat/controller';
import { BusSeatService } from 'src/controllers/busSeat/service';
import { BusSeat } from 'src/entities/busSeat';

@Module({
  imports: [TypeOrmModule.forFeature([BusSeat])],
  controllers: [BusSeatController],
  providers: [BusSeatService],
})
export class BusSeatModule {}
