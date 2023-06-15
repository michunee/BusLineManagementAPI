import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Driver } from './driver';
import { Bus } from './bus';
import { Station } from './station';
import { Ticket } from './ticket';

@Entity({ name: 'Trip' })
export class Trip extends BaseEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ nullable: true })
  BusID: number | null;

  @Column({ nullable: true })
  DriverID: number | null;

  @Column({ nullable: true })
  Price: number | null;

  @Column({ type: 'timestamp' })
  DepartDate: Date;

  @Column({ type: 'timestamp' })
  FinishDate: Date;

  @Column({ default: false })
  IsCompleted: boolean;

  @Column({ default: false })
  IsCancelled: boolean;

  @Column({ nullable: true })
  StartStationID: number | null;

  @Column({ nullable: true })
  EndStationID: number | null;

  @ManyToOne(() => Station, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'StartStationID' })
  startStation: Station | null;

  @ManyToOne(() => Station, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'EndStationID' })
  endStation: Station | null;

  @ManyToOne(() => Bus, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'BusID' })
  bus: Bus | null;

  @ManyToOne(() => Driver, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'DriverID' })
  driver: Driver | null;

  @OneToMany(() => Ticket, (ticket) => ticket.trip, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  tickets: Ticket[] | null;
}
