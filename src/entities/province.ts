import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Station } from './station';

@Entity({ name: 'Province' })
export class Province extends BaseEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 100 })
  Name: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  ImageUrl: string | null;

  @OneToMany(() => Station, (station) => station.province)
  stations: Station[];
}
