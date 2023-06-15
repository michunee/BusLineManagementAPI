import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Ticket } from './entities/ticket';
import { ORDER_BY_DESC } from './base/constants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Excel = require('exceljs');

@Injectable()
export class AppService {
  private readonly region: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly publicBucketName: string;

  constructor() {
    this.region = process.env.AWS_REGION;
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    this.publicBucketName = process.env.AWS_PUBLIC_BUCKET_NAME;
  }

  getLinkMediaKey(mediaKey: string) {
    const s3 = this.getS3();
    return s3.getSignedUrl('getObject', {
      Key: mediaKey,
      Bucket: this.publicBucketName,
      Expires: 60 * 60 * 12 * 365 * 10,
    });
  }

  async upload(file: any) {
    const arr_name = file.originalname.split('.');
    const extension = arr_name.pop();
    const name = arr_name.join('.');
    const key = this.slug(name) + '.' + extension;
    const data = {
      name: name,
      file_name: String(file.originalname),
      mime_type: file.mimetype,
      size: file.size,
      key: key,
    };
    await this.uploadS3(file.buffer, key, file.mimetype);
    return data;
  }

  private async uploadS3(fileBuffer: any, key: string, contentType: string) {
    const s3 = this.getS3();
    const params = {
      Bucket: this.publicBucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read',
    };
    return new Promise((resolve, reject) => {
      s3.upload(params, (err: any, data: any) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
      });
    });
  }

  private getS3() {
    return new S3({
      region: this.region,
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
  }

  private slug(str: string) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from =
      'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;';
    const to =
      'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------';
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  async exportStatistic(res: any, month: number, year: number) {
    try {
      const workbook = new Excel.Workbook();

      const builder = Ticket.createQueryBuilder()
        .leftJoinAndSelect('Ticket.busSeats', 'BusSeat')
        .leftJoinAndSelect('Ticket.person', 'Person')
        .leftJoinAndSelect('Ticket.trip', 'Trip')
        .leftJoinAndSelect('Trip.bus', 'Bus')
        .leftJoinAndSelect('Bus.busType', 'BusType')
        .leftJoinAndSelect('Trip.driver', 'Driver')
        .leftJoinAndSelect('Trip.startStation', 'StartStation')
        .leftJoinAndSelect('Trip.endStation', 'EndStation')
        .leftJoinAndSelect('StartStation.province', 'StartProvince')
        .leftJoinAndSelect('EndStation.province', 'EndProvince')
        .orderBy('Ticket.BoughtDate', ORDER_BY_DESC);

      if (month) {
        builder.andWhere('EXTRACT(month from Ticket.BoughtDate) = :month', {
          month,
        });
      }

      if (year) {
        builder.andWhere('EXTRACT(year from Ticket.BoughtDate) = :year', {
          year,
        });
      }

      const data: any = await builder.getMany();

      const sheet = workbook.addWorksheet('Travel Bus Statistic');
      const columns = [
        { header: 'CustomerName', key: 'customerName', width: 30 },
        { header: 'CustomerEmail', key: 'customerEmail', width: 30 },
        { header: 'StartProvince', key: 'startProvince', width: 30 },
        { header: 'EndProvince', key: 'endProvince', width: 30 },
        { header: 'StartStation', key: 'startStation', width: 30 },
        { header: 'EndStation', key: 'endStation', width: 30 },
        { header: 'DepartureTime', key: 'departureTime', width: 30 },
        { header: 'FinishTime', key: 'finishTime', width: 30 },
        { header: 'TotalPrice', key: 'totalPrice', width: 30 },
        { header: 'BusName', key: 'busName', width: 30 },
        { header: 'BusType', key: 'busType', width: 30 },
        { header: 'BusSlots', key: 'busSlots', width: 30 },
        { header: 'Driver', key: 'driver', width: 30 },
        { header: 'BoughtDate', key: 'boughtDate', width: 30 },
      ];

      sheet.columns = columns;

      sheet.getRow(1).font = {
        color: { argb: 'FFFFFFFF' },
        bold: true,
      };
      sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF00CED1' },
      };
      sheet.autoFilter = {
        from: 'A1',
        to: {
          row: 1,
          column: columns.length,
        },
      };

      data.map((item: any) => {
        sheet.addRow({
          customerName: item?.person?.Name,
          customerEmail: item?.person?.Email,
          startProvince: item?.trip?.startStation?.province?.Name,
          endProvince: item?.trip?.endStation?.province?.Name,
          startStation: item?.trip?.startStation?.Name,
          endStation: item?.trip?.endStation?.Name,
          departureTime: item?.trip?.DepartDate?.toLocaleString(),
          finishTime: item?.trip?.FinishDate?.toLocaleString(),
          totalPrice: item?.TotalPrice?.toLocaleString('vi-VN') + ' VND',
          busName: item?.trip?.bus?.Name,
          busType: item?.trip?.bus?.busType?.Name,
          busSlots: item?.busSeats?.map((item: any) => item.Name).join(', '),
          driver: item?.trip?.driver?.Name,
          boughtDate: item?.BoughtDate?.toLocaleString(),
        });
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );

      if (month) {
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=' + `${month}-${year}-TravelBusStatistic.xlsx`,
        );
      } else {
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=' + `${year}-TravelBusStatistic.xlsx`,
        );
      }

      workbook.xlsx.write(res);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: 'Export failed!',
      });
    }
  }
}
