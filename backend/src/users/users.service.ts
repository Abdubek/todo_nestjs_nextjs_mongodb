import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './users.schema';
import { CreateUserDto } from './users.dto';
import { hash } from 'bcrypt';
import { MongoError } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    dto.username = dto.username.toLowerCase().replaceAll(' ', '');
    dto.password = await hash(dto.password, 10);

    try {
      return await new this.userModel(dto).save();
    } catch (err) {
      if (err.code === 11000) {
        throw new ConflictException(
          `A user with the same name already exists.`,
        );
      }
      // log
      throw new InternalServerErrorException();
    }
  }

  async getUser(
    username: string,
    withPassword?: boolean,
  ): Promise<UserDocument> {
    try {
      const query = this.userModel.findOne({
        username: username.toLowerCase(),
      });

      if (withPassword) {
        query.select('+password');
      }

      return query.exec();
    } catch (err) {
      // log
      throw new InternalServerErrorException();
    }
  }
}
