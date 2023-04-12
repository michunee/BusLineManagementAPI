import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
})
export class RoleModule {}
