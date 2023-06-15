import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PersonService } from 'src/controllers/person/service';
import { GetPersonCommand } from 'src/controllers/person/command/getPerson.command';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: PersonService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data =
            request?.cookies['accessToken'] || request?.headers['accesstoken'];
          if (!data) {
            return null;
          }
          return data;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'my-secret-key',
    });
  }

  async validate(payload: any) {
    const person = await GetPersonCommand.getByID(payload.ID);
    return person;
  }
}
