import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trip } from './trip';
import { BusSeat } from './busSeat';
import { Person } from './person';

@Entity({ name: 'Ticket' })
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ nullable: true })
  TripID: number | null;

  @Column({ nullable: true })
  PersonID: number | null;

  @Column({ type: 'timestamp' })
  BoughtDate: Date;

  @Column()
  TotalPrice: number;

  @ManyToOne(() => Trip, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'TripID' })
  trip: Trip | null;

  @ManyToOne(() => Person, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'PersonID' })
  person: Person | null;

  @ManyToMany(() => BusSeat, (busSeat) => busSeat.tickets)
  @JoinTable({ name: 'BusSeatTicket' })
  busSeats: BusSeat[];
}
