import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusType } from './busType';

@Entity({ name: 'Bus' })
export class Bus {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 50 })
  Name: string;

  @Column({ type: 'varchar', length: 10 })
  RegNo: string;

  @Column({ default: true })
  IsActive: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  Note: string | null;

  @Column({ type: 'timestamp' })
  CreatedDate: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  ImageUrl: string | null;

  @Column()
  BusTypeID: number;

  @ManyToOne(() => BusType)
  @JoinColumn({ name: 'BusTypeID' })
  busType: BusType;
}
