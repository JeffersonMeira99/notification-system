import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Put(':id')
  async markAsCompleted(@Param('id') id: number) {
    return await this.tasksService.markAsCompleted(id);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number): Promise<void> {
    try {
      await this.tasksService.deleteTask(id);
    } catch (error) {
      throw new HttpException('Erro ao excluir tarefa', HttpStatus.NOT_FOUND);
    }
  }
}
