import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO, UpdateTaskDTO } from './tasks.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskDocument } from './tasks.schema';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Sorting, SortingParams } from '../utils/decorators/sorting.decorator';

@ApiTags('Tasks')
@Controller('api/tasks')
export class TasksController {
  constructor(
    private tasksService: TasksService,
    @InjectModel('Task') private taskModel: Model<TaskDocument>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  createTask(@Body() dto: CreateTaskDTO, @Request() req) {
    return this.tasksService.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'sort', type: String, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @Get()
  getTasks(
    @Request() req,
    @Query('search') search?: string,
    @SortingParams(['status', 'createdAt']) sort?: Sorting,
  ) {
    return this.tasksService.getTasksByUserId(req.user.id, sort, search);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  updateTask(@Body() dto: UpdateTaskDTO, @Param('id') id: string) {
    return this.tasksService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Task successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'A task with this id not found.',
  })
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
