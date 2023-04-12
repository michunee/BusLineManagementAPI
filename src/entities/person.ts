import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role';

@Entity({ name: 'Person' })
export class Person {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 50 })
  Username: string;

  @Column({ type: 'varchar', length: 200 })
  Password: string;

  @Column({ type: 'varchar', length: 50 })
  Name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  Email: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Note: string | null;

  @Column({ type: 'timestamp' })
  AddedDate: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  ImageUrl: string | null;

  @ManyToMany(() => Role)
  @JoinTable({ name: 'PersonRole' })
  roles: Role[];
}
