import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { AccessKeyUpdate, RedisService } from '../common/redis.service';

interface KeyStore {
  [key: string]: {
    rateLimit: number;
    expiry: number;
    apiCalls: number;
  };
}

@Injectable()
export class RateLimitService implements OnModuleInit, OnModuleDestroy {
  private keyStore: KeyStore = {};

  constructor(private readonly redisService: RedisService) {}

  async onModuleInit() {
    // Initialize keyStore from Redis
    const storedState = await this.redisService.get('access-key-updates-storage');
    if (storedState) {
      const updates = JSON.parse(storedState);
      Object.entries(updates).forEach(([key, value]: [string, any]) => {
        this.keyStore[key] = {
          rateLimit: value.rateLimit,
          expiry: new Date(value.expiresAt).getTime(),
          apiCalls: value.apiCalls || 0,
        };
      });
    }
  }

  async setKey(key: string, rateLimit: number, expiry: number) {
    const keyData = { rateLimit, expiry, apiCalls: 0 };
    this.keyStore[key] = keyData;

    await this.redisService.publishAccessKeyUpdate({
      apiKey: key,
      rateLimit,
      expiresAt: new Date(expiry).toISOString(),
      apiCalls: 0,
    });

    await this.redisService.set(`key:${key}`, JSON.stringify(keyData), Math.floor((expiry - Date.now()) / 1000));
  }

  async checkLimit(key: string): Promise<boolean> {
    try {
      const keyData: AccessKeyUpdate | undefined = this.redisService.getLatestKeyUpdate(key);
      if (!keyData) return false;

      // Check if key is expired
      if (Date.now() >= new Date(keyData.expiresAt).getTime()) {
        await this.redisService.del(`rate:${key}`);
        delete this.keyStore[key];
        return false;
      }

      const currentCount = await this.redisService.incr(`rate:${key}`);

      // Set expiry for the rate limit counter if it's the first request
      if (currentCount === 1) {
        await this.redisService.expire(`rate:${key}`, 60); // 1 minute expiry
      }

      // Initialize keyStore entry if it doesn't exist
      if (!this.keyStore[key]) {
        this.keyStore[key] = {
          rateLimit: keyData.rateLimit,
          expiry: new Date(keyData.expiresAt).getTime(),
          apiCalls: 0,
        };
      }

      // Update API calls through Redis pub/sub
      const latestUpdate = this.redisService.getLatestKeyUpdate(key);
      if (latestUpdate) {
        this.keyStore[key].apiCalls = (latestUpdate.apiCalls || 0) + 1;
        await this.redisService.publishAccessKeyUpdate({
          ...latestUpdate,
          apiCalls: this.keyStore[key].apiCalls,
        });
      }

      return currentCount <= keyData.rateLimit;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return false;
    }
  }

  async isValidKey(key: string): Promise<boolean> {
    try {
      const keyData: AccessKeyUpdate | undefined = this.redisService.getLatestKeyUpdate(key);
      if (!keyData) return false;

      console.log('Key data:', keyData);

      const { expiresAt } = keyData;
      return Date.now() < new Date(expiresAt).getTime();
    } catch (error) {
      console.error('Key validation failed:', error);
      return false;
    }
  }

  getApiCalls(key: string): number {
    const latestUpdate = this.redisService.getLatestKeyUpdate(key);
    return latestUpdate?.apiCalls || this.keyStore[key]?.apiCalls || 0;
  }

  async onModuleDestroy() {
    // No cleanup needed as RedisService handles it
  }
}
