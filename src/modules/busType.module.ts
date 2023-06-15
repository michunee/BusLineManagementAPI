import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusTypeController } from 'src/controllers/busType/controller';
import { BusTypeService } from 'src/controllers/busType/service';
import { BusType } from 'src/entities/busType';

@Module({
  imports: [TypeOrmModule.forFeature([BusType])],
  controllers: [BusTypeController],
  providers: [BusTypeService],
})
export class BusTypeModule {}
