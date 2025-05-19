import { Injectable, NotFoundException } from '@nestjs/common';
import { TokenResponseDto } from './dto/token.dto';

@Injectable()
export class TokenService {
  private readonly tokens: { [key: string]: TokenResponseDto } = {
    ETH: {
      symbol: 'ETH',
      name: 'Ethereum',
      price: '3120.52',
      network: 'Ethereum',
    },
    BTC: {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: '65432.10',
      network: 'Bitcoin',
    },
  };

  constructor() {
    // Start mock price updates for BTC
    this.startMockPriceUpdates();
  }

  private startMockPriceUpdates() {
    setInterval(() => {
      const currentPrice = parseFloat(this.tokens.BTC.price);
      // Generate random price change between -1% and +1%
      const changePercent = (Math.random() * 2 - 1) / 100;
      const newPrice = currentPrice * (1 + changePercent);
      this.tokens.BTC.price = newPrice.toFixed(2);
    }, 5000); // Update every 5 seconds
  }

  getToken(symbol: string): TokenResponseDto {
    const token = this.tokens[symbol.toUpperCase()];
    if (!token) {
      throw new NotFoundException(`Token with symbol ${symbol} not found`);
    }
    return token;
  }
}
