import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from 'src/entities/route';

@Module({
  imports: [TypeOrmModule.forFeature([Route])],
})
export class RouteModule {}
