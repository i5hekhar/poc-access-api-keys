import { Controller, Get, Patch, Param, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AccessKey } from './entities/access-key.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly adminService: AdminService) {}

  @Get('keys/:userId')
  @ApiOperation({ summary: 'Get user access key details' })
  @ApiParam({ name: 'userId', description: 'The user ID to fetch access key details for' })
  @ApiResponse({ status: 200, description: 'Returns the user access key details', type: AccessKey })
  @ApiResponse({ status: 404, description: 'Access key not found for this user.' })
  async getUserAccessKey(@Param('userId') userId: string): Promise<AccessKey> {
    const keys = await this.adminService.findAll({ userId, active: true });
    if (keys.length === 0) {
      throw new NotFoundException(`No active access key found for user ${userId}`);
    }
    return keys[0];
  }

  @Patch('keys/:userId/disable')
  @ApiOperation({ summary: 'Disable user access key' })
  @ApiParam({ name: 'userId', description: 'The user ID whose access key should be disabled' })
  @ApiResponse({ status: 200, description: 'The access key has been successfully disabled', type: AccessKey })
  @ApiResponse({ status: 404, description: 'Access key not found for this user.' })
  async disableUserAccessKey(@Param('userId') userId: string): Promise<AccessKey> {
    const keys = await this.adminService.findAll({ userId, active: true });
    if (keys.length === 0) {
      throw new NotFoundException(`No active access key found for user ${userId}`);
    }
    return this.adminService.disable(keys[0].id);
  }
}
