import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { RateLimitService } from '../rate-limit/rate-limit.service';
import { RedisService } from '../common/redis.service';

@Module({
  imports: [],
  controllers: [TokenController],
  providers: [TokenService, RateLimitService, RedisService],
})
export class TokenModule {}
