import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAccessKeyDto } from './dto/create-access-key.dto';
import { UpdateAccessKeyDto } from './dto/update-access-key.dto';
import { AccessKey } from './entities/access-key.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('keys')
  @ApiOperation({ summary: 'Create a new access key' })
  @ApiResponse({ status: 201, description: 'The access key has been successfully created.', type: AccessKey })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createAccessKeyDto: CreateAccessKeyDto): Promise<AccessKey> {
    return await this.adminService.create(createAccessKeyDto);
  }

  @Get('keys')
  @ApiOperation({ summary: 'Get all access keys with optional filters' })
  @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'userId', required: false, type: String, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'Return all access keys matching the filters.', type: [AccessKey] })
  async findAll(@Query('active') active?: string, @Query('userId') userId?: string): Promise<AccessKey[]> {
    const filters: { active?: boolean; userId?: string } = {};

    if (active !== undefined) {
      filters.active = active.toLowerCase() === 'true';
    }

    if (userId) {
      filters.userId = userId;
    }

    return await this.adminService.findAll(filters);
  }

  @Patch('keys/:key')
  @ApiOperation({ summary: 'Update an access key' })
  @ApiParam({ name: 'key', description: 'The access key to update' })
  @ApiResponse({ status: 200, description: 'The access key has been successfully updated.', type: AccessKey })
  @ApiResponse({ status: 404, description: 'Access key not found.' })
  async update(@Param('key') key: string, @Body() updateAccessKeyDto: UpdateAccessKeyDto): Promise<AccessKey> {
    return await this.adminService.update(key, updateAccessKeyDto);
  }

  @Delete('keys/:key')
  @ApiOperation({ summary: 'Delete an access key' })
  @ApiParam({ name: 'key', description: 'The access key to delete' })
  @ApiResponse({ status: 200, description: 'The access key has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Access key not found.' })
  async remove(@Param('key') key: string): Promise<void> {
    await this.adminService.remove(key);
  }

  @Get('keys/api-key/:apiKey')
  @ApiOperation({ summary: 'Get access key by API key' })
  @ApiParam({ name: 'apiKey', description: 'The API key to find' })
  @ApiResponse({ status: 200, description: 'Returns the access key details', type: AccessKey })
  @ApiResponse({ status: 404, description: 'Access key not found.' })
  async findByApiKey(@Param('apiKey') apiKey: string): Promise<AccessKey> {
    return await this.adminService.findByApiKey(apiKey);
  }
}
