import { Controller } from '@nestjs/common';
import { BusTypeService } from './service';

@Controller('bus')
export class BusTypeController {
  constructor(private service: BusTypeService) {}
}
