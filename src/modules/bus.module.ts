import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusController } from 'src/controllers/bus/controller';
import { BusService } from 'src/controllers/bus/service';
import { Bus } from 'src/entities/bus';

@Module({
  imports: [TypeOrmModule.forFeature([Bus])],
  controllers: [BusController],
  providers: [BusService],
})
export class BusModule {}
