import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  async findAll() {
    return await this.tasksRepository.find();
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const task = this.tasksRepository.create(createTaskDto);
    return this.tasksRepository.save(task);
  }

  async markAsCompleted(id: number) {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) throw new Error('Task not found');

    task.isCompleted = true;
    await this.tasksRepository.save(task);

    await this.notificationQueue.add('task-completed', {
      taskId: task.id,
      userEmail: task.userEmail,
    });
    return task;
  }

  async deleteTask(id: number) {
    await this.tasksRepository.delete(id);
  }
}
