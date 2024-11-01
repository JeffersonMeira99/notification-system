import { BullModule } from '@nestjs/bull';
import { TasksService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TasksController } from './task.controller';
import { TaskAudit } from './entities/task-audit.entity';
import { Task } from './entities/task.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskAudit]),
    BullModule.registerQueue({
      name: 'notification',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
