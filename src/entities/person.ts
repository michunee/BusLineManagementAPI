import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role';
import { IsIn } from 'class-validator';
import { GENDER } from 'src/base/constants';

@Entity({ name: 'Person' })
export class Person extends BaseEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 50 })
  Name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  Email: string | null;

  @Column({ type: 'varchar', length: 200 })
  Password: string;

  @Column({ type: 'varchar', length: 10 })
  @IsIn(Object.values(GENDER))
  Gender: string;

  @Column({ type: 'date' })
  DateOfBirth: Date;

  @Column({ type: 'varchar', length: 12 })
  CardID: string;

  @Column({ type: 'varchar', length: 100 })
  Address: string;

  @Column({ type: 'varchar', length: 10 })
  Phonenumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Note: string | null;

  @CreateDateColumn()
  AddedDate: Date;

  @Column()
  RoleID: number;

  @Column({ default: true })
  IsActive: boolean;

  @Column({ default: false })
  IsVerify: boolean;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'RoleID' })
  role: Role;
}
