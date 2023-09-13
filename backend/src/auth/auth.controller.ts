import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RefreshTokenDto, SignInDto, TokenDto } from './auth.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/users.dto';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered.',
    type: TokenDto,
  })
  @ApiConflictResponse({
    description: 'A user with the same name already exists.',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  @ApiOkResponse({
    description: 'Authentication completed successfully',
    type: TokenDto,
  })
  @ApiUnauthorizedResponse({ description: 'Authentication failed' })
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('sign-out')
  @ApiOkResponse({ description: 'Logout completed successfully' })
  signOut(@Body() dto: RefreshTokenDto) {
    return this.authService.signOut(dto.refreshToken);
  }

  @Post('refresh')
  @ApiOkResponse({
    description: 'Refresh token completed successfully',
    type: TokenDto,
  })
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<TokenDto> {
    return this.authService.refresh(dto.refreshToken);
  }
}
