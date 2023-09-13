import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/users.dto';
import { TokenService } from './token.service';
import { SignInDto } from './auth.dto';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async signUp(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return this.tokenService.generateToken(user.id);
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.getUser(dto.username, true);

    if (compareSync(dto.password, user.password)) {
      return this.tokenService.generateToken(user.id);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async signOut(refreshToken: string) {
    await this.tokenService.revokeToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    return this.tokenService.refreshToken(refreshToken);
  }
}
