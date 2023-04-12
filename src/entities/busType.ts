import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'BusType' })
export class BusType {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 50 })
  Name: string;

  @Column()
  SeatNum: number;
}
