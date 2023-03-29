import { Province } from 'src/entities/province';

export class ProvinceService {
  public getProvinces() {
    return Province.find();
  }
}
