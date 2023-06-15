import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverController } from 'src/controllers/driver/controller';
import { DriverService } from 'src/controllers/driver/service';
import { Driver } from 'src/entities/driver';

@Module({
  imports: [TypeOrmModule.forFeature([Driver])],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
