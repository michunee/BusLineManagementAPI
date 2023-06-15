import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Driver' })
export class Driver extends BaseEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 50 })
  Name: string;

  @Column({ type: 'varchar', length: 12 })
  CardID: string;

  @Column({ type: 'varchar', length: 10 })
  Gender: string;

  @Column({ type: 'varchar', length: 10 })
  Phonenumber: string;

  @Column({ default: true })
  IsActive: boolean;

  @Column({ type: 'varchar', length: 10 })
  LicenseNo: string;

  @CreateDateColumn()
  AddedDate: Date;

  @Column({ type: 'varchar', length: 5, nullable: true })
  LicenseClass: string;

  @Column({ type: 'date', nullable: true })
  LicenseDate: Date;

  @Column({ type: 'date', nullable: true })
  LicenseExpiredDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Address: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  Note: string | null;
}
