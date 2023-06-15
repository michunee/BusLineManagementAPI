import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  Response,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('access')
  async getFile(@Query('key') key: string) {
    const url = this.appService.getLinkMediaKey(key);
    return {
      url: url,
    };
  }

  // upload single file
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    return await this.appService.upload(file);
  }

  @Get('export')
  public exportStatistic(
    @Response() res: any,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.appService.exportStatistic(res, month, year);
  }
}
