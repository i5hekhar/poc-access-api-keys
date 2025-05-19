import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessKeyDto {
  @ApiProperty({
    description: 'The user ID associated with the access key',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The rate limit for API calls',
    example: 1000,
  })
  @IsNumber()
  @IsNotEmpty()
  rateLimit: number;

  @ApiProperty({
    description: 'The expiration date of the access key',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsNotEmpty()
  expiresAt: string;
}
