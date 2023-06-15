import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusType } from './busType';

@Entity({ name: 'Bus' })
export class Bus extends BaseEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 100 })
  Name: string;

  @Column({ type: 'varchar', length: 10 })
  RegNo: string;

  @Column({ default: true })
  IsActive: boolean;

  @Column({ type: 'varchar', length: 200, nullable: true })
  Note: string | null;

  @CreateDateColumn()
  AddedDate: Date;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  ImageUrl: string | null;

  @Column()
  BusTypeID: number;

  @ManyToOne(() => BusType)
  @JoinColumn({ name: 'BusTypeID' })
  busType: BusType;
}
