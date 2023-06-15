import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketController } from 'src/controllers/ticket/controller';
import { TicketService } from 'src/controllers/ticket/service';
import { Ticket } from 'src/entities/ticket';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
