import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Province } from './province';

@Entity({ name: 'Station' })
export class Station {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 100 })
  Name: string;

  @Column({ type: 'varchar', length: 100 })
  Address: string;

  @Column()
  ProvinceID: number;

  @ManyToOne(() => Province)
  @JoinColumn({ name: 'ProvinceID' })
  province: Province;
}
