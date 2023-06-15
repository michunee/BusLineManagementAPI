import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProvinceModule } from './modules/province.module';
import { StationModule } from './modules/station.module';
import { DriverModule } from './modules/driver.module';
import { PersonModule } from './modules/person.module';
import { RoleModule } from './modules/role.module';
import { BusTypeModule } from './modules/busType.module';
import { BusModule } from './modules/bus.module';
import { BusSeatModule } from './modules/busSeat.module';
import { TripModule } from './modules/trip.module';
import { TicketModule } from './modules/ticket.module';
import { APP_PIPE } from '@nestjs/core';
import { PaypalModule } from './modules/paypal.module';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: parseInt(process.env.PORT),
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"TravelBus" <${config.get('MAIL_USER')}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ProvinceModule,
    StationModule,
    DriverModule,
    PersonModule,
    RoleModule,
    BusTypeModule,
    BusModule,
    BusSeatModule,
    TripModule,
    TicketModule,
    PaypalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: false,
      }),
    },
  ],
})
export class AppModule {}
