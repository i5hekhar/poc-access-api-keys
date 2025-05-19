import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RateLimitService } from './rate-limit.service';
import { RedisService } from 'src/common/redis.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  providers: [RateLimitService, RedisService],
  exports: [RateLimitService],
})
export class RateLimitModule {}
