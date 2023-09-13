import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface AuthPayload {
  id: number;
}
export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @ApiProperty({
    maxLength: 30,
  })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    minLength: 6,
  })
  readonly password: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly refreshToken: string;
}

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly accessToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly refreshToken: string;
}
