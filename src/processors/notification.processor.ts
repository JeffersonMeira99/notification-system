import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';

@Processor('notification')
export class NotificationProcessor {
  @Process('task-completed')
  async handleTaskCompleted(job: Job) {
    const { taskId, userEmail } = job.data;
    console.log(
      `Notificação: Tarefa ${taskId} concluída. Enviar e-mail para ${userEmail}`,
    );
  }
}
