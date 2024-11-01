    import { Test, TestingModule } from '@nestjs/testing';
    import { NotificationProcessor } from './notification.processor';
    import { Job } from 'bullmq';

    describe('NotificationProcessor', () => {
    let processor: NotificationProcessor;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [NotificationProcessor],
        }).compile();

        processor = module.get<NotificationProcessor>(NotificationProcessor);
    });

    describe('handleTaskCompleted', () => {
        it('should log notification message when task is completed', async () => {
        const job: Job = {
            data: {
            taskId: 1,
            userEmail: 'user@example.com',
            },
        } as Job;

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        await processor.handleTaskCompleted(job);

        expect(consoleLogSpy).toHaveBeenCalledWith(
            'Notificação: Tarefa 1 concluída. Enviar e-mail para user@example.com',
        );

        consoleLogSpy.mockRestore();
        });
    });
    });
