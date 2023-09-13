import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskDocument } from './tasks.schema';
import { CreateTaskDTO, UpdateTaskDTO } from './tasks.dto';
import { Sorting } from '../utils/decorators/sorting.decorator';
import { Filter } from '../types';

@Injectable()
export class TasksService {
  constructor(@InjectModel('Task') private taskModel: Model<TaskDocument>) {}

  create(dto: CreateTaskDTO, userId) {
    return new this.taskModel({
      ...dto,
      user: userId,
    }).save();
  }

  async update(id: string, dto: UpdateTaskDTO) {
    await this.taskModel.updateOne(
      {
        _id: id,
      },
      dto,
    );
    return this.taskModel.findOne({
      _id: id,
    });
  }

  async delete(id: string) {
    try {
      await this.taskModel.deleteOne({
        _id: id,
      });
    } catch (err) {
      throw new NotFoundException();
    }
  }

  getTasksByUserId(userId: string, sort?: Sorting, search?: string) {
    const query = this.taskModel.find({
      user: userId,
    });
    if (search) {
      query.where({
        title: new RegExp(search, 'i'),
      });
    }
    if (sort) {
      query.sort({
        [sort.property]: sort.direction,
      });
    } else {
      query.sort({
        createdAt: 'desc',
      });
    }
    return query.exec();
  }
}
