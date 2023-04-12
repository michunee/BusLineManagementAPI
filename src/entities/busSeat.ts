import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusType } from './busType';

@Entity({ name: 'BusSeat' })
export class BusSeat {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  BusTypeID: number;

  @Column({ type: 'varchar', length: 10 })
  Name: string;

  @ManyToOne(() => BusType)
  @JoinColumn({ name: 'BusTypeID' })
  busType: BusType;
}
