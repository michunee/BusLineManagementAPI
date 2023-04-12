import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Passenger' })
export class Passenger {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 50 })
  Name: string;

  @Column()
  IdCard: number;

  @Column({ type: 'varchar', length: 10 })
  Gender: string;

  @Column({ type: 'date' })
  DateOfBirth: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  Email: string | null;

  @Column({ type: 'varchar', length: 10 })
  Phone: string;

  @Column({ type: 'varchar', length: 100 })
  Address: string;

  @Column({ default: true })
  IsBlocked: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Note: string | null;

  @Column({ type: 'timestamp' })
  AddedDate: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  ImageUrl: string | null;
}
