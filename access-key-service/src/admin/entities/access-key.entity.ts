import { ApiProperty } from '@nestjs/swagger';

export class AccessKey {
  @ApiProperty({
    description: 'The unique identifier of the access key',
    example: 'ak_123456789',
  })
  id: string;

  @ApiProperty({
    description: 'The user ID associated with the access key',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'The rate limit for API calls',
    example: 1000,
  })
  rateLimit: number;

  @ApiProperty({
    description: 'The expiration date of the access key',
    example: '2024-12-31T23:59:59Z',
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'Whether the access key is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'The creation date of the access key',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the access key',
    example: '2024-01-01T00:00:00Z',
  })
  updatedAt: Date;
}
