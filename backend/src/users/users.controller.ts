import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './users.dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}
}
