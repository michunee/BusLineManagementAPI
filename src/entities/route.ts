import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Station } from './station';
import { RestArea } from './restArea';

@Entity({ name: 'Route' })
export class Route {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ nullable: true })
  OriginStationID: number | null;

  @Column({ nullable: true })
  DestinationStationID: number | null;

  @Column()
  Price: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  ImageUrl: string | null;

  @ManyToOne(() => Station, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'OriginStationID' })
  originStation: Station | null;

  @ManyToOne(() => Station, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'DestinationStationID' })
  destinationStation: Station | null;

  @ManyToMany(() => RestArea)
  @JoinTable({ name: 'RouteRestArea' })
  restAreas: RestArea[];
}
