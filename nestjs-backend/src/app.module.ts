import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeoController } from './geo/geo.controller';
import { GeoService } from './geo/geo.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'redis',
            port: parseInt(process.env.REDIS_PORT) || 6379,
          },
        }),
        ttl: 300,
      }),
    }),
  ],
  controllers: [AppController, GeoController],
  providers: [AppService, GeoService],
})
export class AppModule {}
