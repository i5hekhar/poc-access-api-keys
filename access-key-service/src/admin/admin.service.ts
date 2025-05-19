import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccessKeyDto } from './dto/create-access-key.dto';
import { UpdateAccessKeyDto } from './dto/update-access-key.dto';
import { AccessKey, AccessKeyDocument } from './entities/access-key.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisService } from 'src/common/redis.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(AccessKey.name) private accessKeyModel: Model<AccessKeyDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private redisService: RedisService
  ) {}

  async create(createAccessKeyDto: CreateAccessKeyDto): Promise<AccessKey> {
    const createdKey = await this.accessKeyModel.create({
      ...createAccessKeyDto,
      expiresAt: new Date(createAccessKeyDto.expiresAt),
    });

    if (!createdKey) {
      throw new NotFoundException('Access key not found');
    }

    // Store in Redis and publish update
    const ttl = Math.floor((new Date(createdKey.expiresAt).getTime() - Date.now()) / 1000);
    await this.cacheManager.set(createdKey.apiKey, JSON.stringify(createdKey), ttl);
    await this.redisService.publishAccessKeyUpdate({
      apiKey: createdKey.apiKey,
      rateLimit: createdKey.rateLimit,
      expiresAt: new Date(createdKey.expiresAt).toISOString(),
      apiCalls: 0,
    });

    return createdKey;
  }

  async findAll(filters: { active?: boolean; userId?: string }): Promise<AccessKey[]> {
    const keys = await this.accessKeyModel.find(filters).exec();

    // Enhance keys with latest updates from Redis
    return Promise.all(
      keys.map(async (key) => {
        const latestUpdate = this.redisService.getLatestKeyUpdate(key.apiKey);
        if (latestUpdate) {
          return {
            ...key.toObject(),
            ...latestUpdate,
            expiresAt: new Date(latestUpdate.expiresAt),
          };
        }
        return key;
      })
    );
  }

  async findOne(id: string): Promise<AccessKey> {
    const key = await this.accessKeyModel.findById(id).exec();
    if (!key) {
      throw new NotFoundException(`Access key with ID ${id} not found`);
    }

    // Check for latest updates from Redis
    const latestUpdate = this.redisService.getLatestKeyUpdate(key.apiKey);
    if (latestUpdate) {
      return {
        ...key.toObject(),
        ...latestUpdate,
        expiresAt: new Date(latestUpdate.expiresAt),
      };
    }

    return key;
  }

  async update(key: string, updateAccessKeyDto: UpdateAccessKeyDto): Promise<AccessKey> {
    console.log('updateAccessKeyDto', updateAccessKeyDto);
    const updatedKey = await this.accessKeyModel.findOneAndUpdate({ apiKey: key }, updateAccessKeyDto, { new: true }).exec();

    if (!updatedKey) {
      throw new NotFoundException('Access key not found');
    }

    // Publish update to Redis
    await this.redisService.publishAccessKeyUpdate({
      apiKey: updatedKey.apiKey,
      rateLimit: updatedKey.rateLimit,
      expiresAt: new Date(updatedKey.expiresAt).toISOString(),
      apiCalls: 0,
    });

    return updatedKey;
  }

  async remove(key: string): Promise<void> {
    const keyToDelete = await this.accessKeyModel.findById(key).exec();
    if (!keyToDelete) {
      throw new NotFoundException('Access key not found');
    }

    const result = await this.accessKeyModel.deleteOne({ _id: key }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Access key not found');
    }

    // Publish deletion to Redis
    await this.redisService.publishAccessKeyDeletion(keyToDelete.apiKey);
  }

  async disable(id: string): Promise<AccessKey> {
    const key = await this.accessKeyModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();

    if (!key) {
      throw new NotFoundException(`Access key with ID ${id} not found`);
    }

    // Publish update to Redis
    await this.redisService.publishAccessKeyUpdate({
      apiKey: key.apiKey,
      rateLimit: key.rateLimit,
      expiresAt: new Date(key.expiresAt).toISOString(),
      apiCalls: 0,
    });

    return key;
  }

  async findByApiKey(apiKey: string): Promise<AccessKey> {
    const key = await this.accessKeyModel.findOne({ apiKey }).exec();
    if (!key) {
      throw new NotFoundException(`Access key with API key ${apiKey} not found`);
    }

    // Check for latest updates from Redis
    const latestUpdate = this.redisService.getLatestKeyUpdate(key.apiKey);
    if (latestUpdate) {
      return {
        ...key.toObject(),
        ...latestUpdate,
        expiresAt: new Date(latestUpdate.expiresAt),
      };
    }

    return key;
  }
}
