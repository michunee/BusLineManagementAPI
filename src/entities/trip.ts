import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Route } from './route';
import { Driver } from './driver';
import { Bus } from './bus';

@Entity({ name: 'Trip' })
export class Trip {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ nullable: true })
  RouteID: number | null;

  @Column({ nullable: true })
  BusID: number | null;

  @Column({ nullable: true })
  DriverID: number | null;

  @Column({ nullable: true })
  TotalRevenue: number | null;

  @Column({ type: 'timestamp' })
  DepartDate: Date;

  @Column({ default: false })
  IsCancelled: boolean;

  @Column()
  Durration: number;

  @Column({ default: false })
  IsCompleted: boolean;

  @ManyToOne(() => Route, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'RouteID' })
  route: Route | null;

  @ManyToOne(() => Bus, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'BusID' })
  bus: Bus | null;

  @ManyToOne(() => Driver, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'DriverID' })
  driver: Driver | null;
}
