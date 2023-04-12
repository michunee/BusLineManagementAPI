import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProvinceModule } from './modules/province.module';
import { StationModule } from './modules/station.module';
import { RestAreaModule } from './modules/restArea.module';
import { RouteModule } from './modules/route.module';
import { DriverModule } from './modules/driver.module';
import { PassengerModule } from './modules/passenger.module';
import { PersonModule } from './modules/person.module';
import { RoleModule } from './modules/role.module';
import { NotificationModule } from './modules/notification.module';
import { TimeSheetModule } from './modules/timeSheet.module';
import { BusTypeModule } from './modules/busType.module';
import { BusModule } from './modules/bus.module';
import { BusSeatModule } from './modules/busSeat.module';
import { TripModule } from './modules/trip.module';
import { TicketModule } from './modules/ticket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://michu:vx8Y8QJbX9evHVbJOjoRdxypR5UZlZRD@dpg-cghfcot269v15elqj710-a.singapore-postgres.render.com/buslinemanagement_kzwd',
      ssl: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProvinceModule,
    StationModule,
    RestAreaModule,
    RouteModule,
    DriverModule,
    PassengerModule,
    PersonModule,
    RoleModule,
    NotificationModule,
    TimeSheetModule,
    BusTypeModule,
    BusModule,
    BusSeatModule,
    TripModule,
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
