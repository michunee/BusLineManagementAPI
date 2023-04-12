import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Person } from './person';

@Entity({ name: 'Notification' })
export class Notification {
  @PrimaryGeneratedColumn()
  iD: number;

  @Column({ type: 'varchar', length: 200 })
  Message: string;

  @Column({ type: 'timestamp' })
  Date: Date;

  @Column({ nullable: true })
  CreatedByID: number | null;

  @ManyToOne(() => Person, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'CreatedByID' })
  createdBy: Person | null;
}
