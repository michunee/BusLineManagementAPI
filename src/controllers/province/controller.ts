import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { ProvinceService } from './service';

@Controller('province')
export class ProvinceController {
  private service: ProvinceService;

  constructor() {
    this.service = new ProvinceService();
  }

  @Get()
  public getProvinces() {
    return this.service.getProvinces();
  }
}
