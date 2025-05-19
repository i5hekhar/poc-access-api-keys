import { IsNumber, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccessKeyDto {
  @ApiProperty({
    description: 'The new rate limit for API calls',
    example: 2000,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  rateLimit?: number;

  @ApiProperty({
    description: 'The new expiration date of the access key',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
