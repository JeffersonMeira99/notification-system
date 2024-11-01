import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationProcessor } from './processors/notification.processor';
import { BullModule } from '@nestjs/bull';
import { TasksModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    TasksModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, NotificationProcessor],
})
export class AppModule {}
