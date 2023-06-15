import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BusSeat } from './busSeat';

@Entity({ name: 'BusType' })
export class BusType {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 50 })
  Name: string;

  @Column()
  SeatNum: number;

  @OneToMany(() => BusSeat, (busSeat) => busSeat.busType)
  busSeats: BusType[];
}
