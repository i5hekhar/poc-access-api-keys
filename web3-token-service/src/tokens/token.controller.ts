import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { TokenService } from './token.service';
import { TokenResponseDto } from './dto/token.dto';
import { ApiKeyGuard } from '../auth/api-key.guard';

@ApiTags('tokens')
@Controller('tokens')
@UseGuards(ApiKeyGuard)
@ApiBearerAuth('api-key')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get(':symbol')
  @ApiOperation({ summary: 'Get token information by symbol' })
  @ApiParam({
    name: 'symbol',
    description: 'Token symbol (e.g., BTC, ETH)',
    example: 'BTC',
  })
  @ApiResponse({
    status: 200,
    description: 'Token information retrieved successfully',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired API key',
  })
  @ApiResponse({
    status: 429,
    description: 'Rate limit exceeded',
  })
  @ApiResponse({
    status: 404,
    description: 'Token not found',
  })
  getToken(@Param('symbol') symbol: string): TokenResponseDto {
    try {
      return this.tokenService.getToken(symbol);
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  }
}
