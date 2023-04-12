import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/entities/ticket';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
})
export class TicketModule {}
