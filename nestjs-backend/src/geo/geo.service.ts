import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PointListRequest } from './geo.dto';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class GeoService {
  private readonly fastApiUrl = process.env.FASTAPI_URL || 'http://fastapi-backend:8000';

  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async processCoordinates(pointListRequest: PointListRequest) {
    const cacheKey = this.generateCacheKey(pointListRequest.points);
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.fastApiUrl}/process-coordinates`, pointListRequest)
      );

      await this.cacheManager.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error;
      }
      throw new Error('Failed to process coordinates');
    }
  }

  private generateCacheKey(points: any[]): string {
    const sortedPoints = points
      .map(p => `${p.lat},${p.lng}`)
      .sort()
      .join('|');
    return `geo:${Buffer.from(sortedPoints).toString('base64')}`;
  }
}