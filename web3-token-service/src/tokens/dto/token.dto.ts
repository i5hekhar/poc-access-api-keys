import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    description: 'Token symbol (e.g., BTC, ETH)',
    example: 'BTC',
  })
  symbol: string;

  @ApiProperty({
    description: 'Token name',
    example: 'Bitcoin',
  })
  name: string;

  @ApiProperty({
    description: 'Current token price in USD',
    example: '65432.10',
  })
  price: string;

  @ApiProperty({
    description: 'Blockchain network name',
    example: 'Bitcoin',
  })
  network: string;
}
