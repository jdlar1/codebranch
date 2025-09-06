import { Controller, Post, Body, Get, HttpStatus, HttpException } from '@nestjs/common';
import { GeoService } from './geo.service';
import { PointListRequest } from './geo.dto';

@Controller()
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Get('health')
  healthCheck() {
    return { status: 'healthy', service: 'nestjs-middleware' };
  }

  @Post('process-coordinates')
  async processCoordinates(@Body() pointListRequest: PointListRequest) {
    try {
      return await this.geoService.processCoordinates(pointListRequest);
    } catch (error) {
      if (error.response?.status === 400) {
        throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}