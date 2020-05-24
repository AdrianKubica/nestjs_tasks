import { Controller, Get, Post, Body, Param, Delete, /*Res, HttpStatus,*/ Patch, Query, HttpCode, HttpStatus, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor, Logger } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { CreateTaskDto } from './dto/create.task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('/tasks')
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
export class TasksController {
  private logger = new Logger('TaksController')
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User
    ): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. Filter: ${JSON.stringify(filterDto)}`)
    return await this.tasksService.getTasks(filterDto, user)
  }

  @Get('/:id')
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
    ): Promise<Task> {
    return await this.tasksService.getTaskById(id, user)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
    ): Promise<Task> {
    this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`)
    return await this.tasksService.createTask(createTaskDto, user)
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
    ): Promise<void> {
    return this.tasksService.deleteTask(id, user)
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
    return await this.tasksService.updateTaskStatus(id, status, user)
  }
}
