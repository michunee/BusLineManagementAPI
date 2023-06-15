import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { PersonService } from './service';
import {
  PersonChangePasswordInput,
  PersonInput,
  PersonUpdateInput,
} from './model';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Person } from 'src/entities/person';

@Controller('person')
export class PersonController {
  constructor(private service: PersonService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  public insertPerson(
    @Body() input: PersonInput,
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.insertPerson(input, currentPerson);
  }

  @Post('signin')
  public signIn(
    @Body() input: { Email: string; Password: string },
    @Response({ passthrough: true }) res: any,
  ) {
    return this.service.signIn(input, res);
  }

  @Post('signup')
  public signUp(@Body() input: PersonInput) {
    return this.service.signUp(input);
  }

  @Post('forgot-password')
  public forgotPassword(@Body() body: { Email: string }) {
    return this.service.forgotPassword(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('signout')
  public signout(@Response({ passthrough: true }) res: any) {
    return this.service.signout(res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  public getPersons(
    @CurrentUser() currentPerson: Person,
    @Query('filter') filter: string,
  ) {
    return this.service.getPersons(currentPerson, filter);
  }

  @Get('verify')
  public verifyEmail(
    @Response({ passthrough: true }) res: any,
    @Query('email') email: string,
  ) {
    return this.service.verifyEmail(res, email);
  }

  @Get('change-password')
  public getChangePasswordLink(
    @Query('email') email: string,
    @Query('password') password: string,
    @Response({ passthrough: true }) res: any,
  ) {
    return this.service.getChangePasswordLink(email, password, res);
  }

  @Post('change-password')
  public changeForgotPassword(@Body() input: PersonChangePasswordInput) {
    return this.service.changeForgotPassword(input);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('status')
  public changePersonStatus(
    @Body() input: { PersonID: number; IsActive: boolean },
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.changePersonStatus(input, currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('role')
  public changePersonRole(
    @Body() input: { PersonID: number; RoleID: number },
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.changePersonRole(input, currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/password')
  public changePassword(
    @Body()
    input: {
      CurrentPassword: string;
      NewPassword: string;
      ConfirmPassword: string;
    },
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.changePassword(input, currentPerson);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public getPerson(@Param('id') PersonID: string) {
    return this.service.getPerson(parseInt(PersonID));
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch()
  public updatePerson(
    @Body() input: PersonUpdateInput,
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.updatePerson(input, currentPerson);
  }
}
