import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { RateLimitService } from '../rate-limit/rate-limit.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly rateLimitService: RateLimitService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    console.log('apiKey', apiKey);

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    if (!(await this.rateLimitService.isValidKey(apiKey))) {
      throw new UnauthorizedException('Invalid or expired key');
    }

    if (!(await this.rateLimitService.checkLimit(apiKey))) {
      throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }
}
