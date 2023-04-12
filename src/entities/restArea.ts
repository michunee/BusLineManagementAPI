import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Province } from './province';
import { Route } from './route';

@Entity({ name: 'RestArea' })
export class RestArea {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 100 })
  Name: string;

  @Column({ type: 'varchar', length: 100 })
  Address: string;

  @Column()
  ProvinceID: number;

  @ManyToOne(() => Province)
  @JoinColumn({ name: 'ProvinceID' })
  province: Province;

  @ManyToMany(() => Route)
  @JoinTable({ name: 'RouteRestArea' })
  routes: Route[];
}
