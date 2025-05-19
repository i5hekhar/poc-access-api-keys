import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenModule } from './tokens/token.module';
import { RateLimitService } from './rate-limit/rate-limit.service';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import * as redisStore from 'cache-manager-redis-store';
import { getMongoConfig } from '@database/database.config';
import { RedisService } from './common/redis.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => getMongoConfig(),
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000, // 1 minute default TTL
    }),
    TokenModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    RateLimitService,
    RedisService,
  ],
  exports: [RateLimitService],
})
export class AppModule {}
