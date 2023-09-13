import { BadRequestException, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload, TokenDto } from './auth.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private jwtService: JwtService,
  ) {}

  async generateToken(accountId: number): Promise<TokenDto> {
    const accessToken = this.jwtService.sign(
      { id: accountId },
      {
        secret: 'secret',
        expiresIn: '5m',
      },
    );
    const refreshToken = this.jwtService.sign(
      { id: accountId },
      {
        secret: 'secret',
        expiresIn: '7d',
      },
    );

    const key = `auth:${refreshToken}:${accountId}`;
    this.redis.set(key, 1, () => {
      this.redis.expire(key, 7 * 24 * 60 * 60);
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async revokeToken(refreshToken: string): Promise<void> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: 'secret',
    });
    await this.redis.del(`auth:${refreshToken}:${payload.id}`);
  }

  async revokeTokensByAccountId(accountId: number): Promise<void> {
    const keys = await this.redis.keys(`auth:*:${accountId}`);

    keys.forEach((key) => {
      this.redis.del(key);
    });
  }

  async refreshToken(refreshToken: string): Promise<TokenDto> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: 'secret',
    });
    const keys = await this.redis.keys(`auth:${refreshToken}:${payload.id}`);
    if (keys.length) {
      await this.revokeToken(refreshToken);

      return this.generateToken(payload.id);
    } else {
      throw new BadRequestException();
    }
  }

  extractPayload(token: string): AuthPayload {
    return this.jwtService.verify(token, {
      secret: 'secret',
    });
  }
}
