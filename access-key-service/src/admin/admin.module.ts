import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserController } from './user.controller';
import { AccessKey, AccessKeySchema } from './entities/access-key.schema';
import { RedisService } from 'src/common/redis.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: AccessKey.name, schema: AccessKeySchema }])],
  controllers: [AdminController, UserController],
  providers: [AdminService, RedisService],
  exports: [AdminService],
})
export class AdminModule {}
