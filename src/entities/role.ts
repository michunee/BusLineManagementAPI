import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Person } from './person';

@Entity({ name: 'Role' })
export class Role {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 50 })
  Name: string;

  @ManyToMany(() => Person)
  @JoinTable({ name: 'PersonRole' })
  persons: Person[];
}
