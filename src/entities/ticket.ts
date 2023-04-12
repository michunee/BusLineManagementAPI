import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Passenger } from './passenger';
import { Trip } from './trip';
import { Bus } from './bus';
import { BusSeat } from './busSeat';

@Entity({ name: 'Ticket' })
export class Ticket {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ nullable: true })
  TripID: number | null;

  @Column({ nullable: true })
  PassengerID: number | null;

  @Column({ nullable: true })
  BusID: number | null;

  @Column({ nullable: true })
  BusSeatID: number | null;

  @Column({ nullable: true })
  Price: number | null;

  @Column({ type: 'timestamp' })
  BoughtDate: Date;

  @ManyToOne(() => Trip, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'TripID' })
  trip: Trip | null;

  @ManyToOne(() => Passenger, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'PassengerID' })
  passenger: Passenger | null;

  @ManyToOne(() => Bus, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'BusID' })
  bus: Bus | null;

  @ManyToOne(() => BusSeat, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'BusSeatID' })
  busSeat: BusSeat | null;
}
