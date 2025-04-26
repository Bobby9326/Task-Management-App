import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthenticatedRequest } from './authenticated-request.interface';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';


@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
@ApiTags('Task (Require Login)')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @ApiOperation({ summary: 'Use to create a new task.' })
  @Post()
  async createTask(@Request() req: AuthenticatedRequest, @Body() body: CreateTaskDto) {
    try {
      const task = await this.taskService.createTask(req.user.id, body);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Create task successfully',
        data: task,
      };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'USER_NOT_FOUND') {
        throw new NotFoundException('User not found');
      }
    }
  }

  @ApiOperation({ summary: 'Use to get all tasks for the authenticated user' })
  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    const allTask = await this.taskService.findAllByUser(req.user.id);
    return {
      statusCode: HttpStatus.OK,
      data: allTask,
    };
  }

  @ApiOperation({ summary: 'Use to get details of a specific task' })
  @Get(':id')
  async findOne(@Param('id') id: string,) {
    try {
      const task = await this.taskService.findTaskById(id);
      return { statusCode: HttpStatus.OK, data: task };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'TASK_NOT_FOUND') {
        throw new NotFoundException('Task not found');
      }
    }
  }

  @ApiOperation({
    summary: 'Use to update a task (title, description, status)',
  })
  @Patch(':id')
  async updateTask(@Param('id') id: string,@Body() updateTaskDto: UpdateTaskDto,){
    try {
      const newTask = await this.taskService.updateTask(id, updateTaskDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Update task successfully',
        data: newTask,
      };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'TASK_NOT_FOUND') {
        throw new NotFoundException('Task not found');
      }
    }
  }

  @ApiOperation({ summary: 'Use to delete a specific task' })
  @Delete(':id')
  async removeTask(@Param('id') id: string,){
    try {
      await this.taskService.removeTask(id);
      return { statusCode: HttpStatus.OK, message: 'Delete task successfully' };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'TASK_NOT_FOUND') {
        throw new NotFoundException('Task not found');
      }
    }
  }
}