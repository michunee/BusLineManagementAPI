import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonController } from 'src/controllers/person/controller';
import { PersonService } from 'src/controllers/person/service';
import { Person } from 'src/entities/person';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'my-secret-key',
    }),
    TypeOrmModule.forFeature([Person]),
  ],
  controllers: [PersonController],
  providers: [PersonService, JwtStrategy],
})
export class PersonModule {}
