import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Role' })
export class Role {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column({ type: 'varchar', length: 50 })
  Name: string;
}
