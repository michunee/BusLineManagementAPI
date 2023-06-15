import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripController } from 'src/controllers/trip/controller';
import { TripService } from 'src/controllers/trip/service';
import { Trip } from 'src/entities/trip';

@Module({
  imports: [TypeOrmModule.forFeature([Trip])],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
