import { Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { PaypalService } from './service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { Person } from 'src/entities/person';

@Controller('paypal')
export class PaypalController {
  constructor(private service: PaypalService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  public getPaypalPayment(
    @Request() req: any,
    @Response() res: any,
    @CurrentUser() currentPerson: Person,
  ) {
    return this.service.getPaypalPayment(req, res, currentPerson);
  }

  @Get('success')
  public getPaypalPaymentSuccess(@Request() req: any, @Response() res: any) {
    return this.service.getPaypalPaymentSuccess(req, res);
  }

  @Get('cancel')
  public getPaypalPaymentCancel(@Request() req: any, @Response() res: any) {
    return this.service.getPaypalPaymentCancel(req, res);
  }
}
