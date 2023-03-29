import { Controller } from '@nestjs/common';
import { StationService } from './service';

@Controller('station')
export class StationController {
  private service: StationService;

  constructor() {
    this.service = new StationService();
  }
}
