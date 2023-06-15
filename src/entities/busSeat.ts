import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusType } from './busType';
import { Ticket } from './ticket';

@Entity({ name: 'BusSeat' })
export class BusSeat extends BaseEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  BusTypeID: number;

  @Column({ type: 'varchar', length: 10 })
  Name: string;

  @ManyToOne(() => BusType)
  @JoinColumn({ name: 'BusTypeID' })
  busType: BusType;

  @ManyToMany(() => Ticket, (ticket) => ticket.busSeats)
  tickets: Ticket[];
}
