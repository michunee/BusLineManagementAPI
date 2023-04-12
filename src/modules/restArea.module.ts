import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestArea } from 'src/entities/restArea';

@Module({
  imports: [TypeOrmModule.forFeature([RestArea])],
})
export class RestAreaModule {}
