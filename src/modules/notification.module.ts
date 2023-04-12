import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
})
export class NotificationModule {}
