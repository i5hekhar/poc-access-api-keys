import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

export interface AccessKeyUpdate {
  apiKey: string;
  rateLimit: number;
  expiresAt: string;
  apiCalls: number;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly publisher: Redis;
  private readonly subscriber: Redis;
  private readonly CHANNEL_NAME = 'access-key-updates';
  private readonly keyUpdates: Map<string, AccessKeyUpdate> = new Map();
  private readonly KEY_UPDATES_STORAGE_KEY = 'access-key-updates-storage';

  constructor() {
    this.publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
    });
    this.subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
    });
  }

  async onModuleInit() {
    // Load previous state
    await this.loadKeyUpdatesState();

    // Subscribe to the channel
    await this.subscriber.subscribe(this.CHANNEL_NAME);

    // Handle incoming messages
    this.subscriber.on('message', async (channel, message) => {
      if (channel === this.CHANNEL_NAME) {
        const updateData = JSON.parse(message);
        await this.handleAccessKeyUpdate(updateData);
      }
    });
  }

  private async loadKeyUpdatesState() {
    const storedState = await this.publisher.get(this.KEY_UPDATES_STORAGE_KEY);
    if (storedState) {
      const updates = JSON.parse(storedState);
      this.keyUpdates.clear();
      Object.entries(updates).forEach(([key, value]) => {
        this.keyUpdates.set(key, value as AccessKeyUpdate);
      });
    }
  }

  private async persistKeyUpdatesState() {
    const updates = Object.fromEntries(this.keyUpdates);
    await this.publisher.set(this.KEY_UPDATES_STORAGE_KEY, JSON.stringify(updates));
  }

  private async handleAccessKeyUpdate(updateData: any) {
    const { type, data } = updateData;

    switch (type) {
      case 'update':
        this.keyUpdates.set(data.apiKey, data);
        await this.persistKeyUpdatesState();
        break;
      case 'delete':
        this.keyUpdates.delete(data.apiKey);
        await this.persistKeyUpdatesState();
        break;
      default:
        console.warn(`Unknown update type: ${type}`);
    }
  }

  async publishAccessKeyUpdate(accessKey: AccessKeyUpdate) {
    const message = JSON.stringify({
      type: 'update',
      data: accessKey,
      timestamp: new Date().toISOString(),
    });

    await this.publisher.publish(this.CHANNEL_NAME, message);
  }

  async publishAccessKeyDeletion(apiKey: string) {
    const message = JSON.stringify({
      type: 'delete',
      data: { apiKey },
      timestamp: new Date().toISOString(),
    });

    await this.publisher.publish(this.CHANNEL_NAME, message);
  }

  getLatestKeyUpdate(apiKey: string): AccessKeyUpdate | undefined {
    return this.keyUpdates.get(apiKey);
  }

  async set(key: string, value: string, expirySeconds?: number): Promise<void> {
    if (expirySeconds) {
      await this.publisher.set(key, value, 'EX', expirySeconds);
    } else {
      await this.publisher.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.publisher.get(key);
  }

  async del(key: string): Promise<void> {
    await this.publisher.del(key);
  }

  async incr(key: string): Promise<number> {
    return await this.publisher.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.publisher.expire(key, seconds);
  }

  async onModuleDestroy() {
    await this.publisher.quit();
    await this.subscriber.quit();
  }
}
