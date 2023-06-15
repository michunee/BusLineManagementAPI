import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Province } from './province';

@Entity({ name: 'Station' })
export class Station extends BaseEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 100 })
  Name: string;

  @Column({ type: 'varchar', length: 100 })
  Address: string;

  @Column()
  ProvinceID: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  Note: string;

  @Column({ default: true })
  IsActive: boolean;

  @ManyToOne(() => Province)
  @JoinColumn({ name: 'ProvinceID' })
  province: Province;
}
