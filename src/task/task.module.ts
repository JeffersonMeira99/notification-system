import { BullModule } from '@nestjs/bull';
import { TasksService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Module } from '@nestjs/common';
import { TasksController } from './task.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
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
