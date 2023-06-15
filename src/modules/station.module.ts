import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationController } from 'src/controllers/station/controller';
import { StationService } from 'src/controllers/station/service';
import { Station } from 'src/entities/station';

@Module({
  imports: [TypeOrmModule.forFeature([Station])],
  controllers: [StationController],
  providers: [StationService],
})
export class StationModule {}
