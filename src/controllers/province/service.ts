import { GetProvinceCommand } from './command/getProvince.command';

export class ProvinceService {
  public getProvinces() {
    return GetProvinceCommand.get();
  }
}
