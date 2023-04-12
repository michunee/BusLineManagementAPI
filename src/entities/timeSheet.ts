import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Person } from './person';

@Entity({ name: 'TimeSheet' })
export class TimeSheet {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'date' })
  WorkDate: Date;

  @Column({ nullable: true })
  IsWorkMorning: boolean | null;

  @Column({ nullable: true })
  IsWorkEvening: boolean | null;

  @Column({ nullable: true })
  PersonID: number | null;

  @ManyToOne(() => Person, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'PersonID' })
  person: Person | null;
}
