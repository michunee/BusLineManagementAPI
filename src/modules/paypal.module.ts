import { Module } from '@nestjs/common';
import { PaypalController } from 'src/controllers/paypal/controller';
import { PaypalService } from 'src/controllers/paypal/service';

@Module({
  controllers: [PaypalController],
  providers: [PaypalService],
})
export class PaypalModule {}
