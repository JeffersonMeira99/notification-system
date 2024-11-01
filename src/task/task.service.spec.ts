import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { Queue } from 'bullmq';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './task.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TasksController } from './task.controller';

const mockTaskRepository = {
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
  save: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({ affected: 1, raw: {} }),
  create: jest.fn(),
};

const mockQueue = {
  add: jest.fn().mockResolvedValue({}),
  on: jest.fn(),
};

const mockBullQueueNotification = {
  add: jest.fn().mockResolvedValue({}),
  on: jest.fn(),
};

describe('TasksService', () => {
  let controller: TasksController;
  let service: TasksService;
  let tasksRepository: Repository<Task>;
  let notificationQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],

      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: 'BullQueue',
          useValue: mockQueue,
        },
        {
          provide: 'BullQueue_notification',
          useValue: mockBullQueueNotification,
        },
      ],
    }).compile();
    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
    tasksRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    notificationQueue = module.get<Queue>('BullQueue');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const result = [new Task()];
      jest.spyOn(tasksRepository, 'find').mockResolvedValue(result);
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task description',
        userEmail: 'jefferson.meira@teste.com.br',
      };
      const task = new Task();
      task.id = 1;
      task.isCompleted = false;
      jest.spyOn(tasksRepository, 'create').mockReturnValue(task);
      jest.spyOn(tasksRepository, 'save').mockResolvedValue(task);

      expect(await service.createTask(createTaskDto)).toBe(task);
      expect(tasksRepository.create).toHaveBeenCalledWith(createTaskDto);
      expect(tasksRepository.save).toHaveBeenCalledWith(task);
    });
  });

  describe('markAsCompleted', () => {
    it('should mark a task as completed and add notification to queue', async () => {
      const taskId = 1;
      const task = new Task();
      task.id = taskId;
      task.isCompleted = false;

      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(task);
      jest.spyOn(tasksRepository, 'save').mockResolvedValue(task);

      await service.markAsCompleted(taskId);

      expect(task.isCompleted).toBe(true); // Verifica se a tarefa foi marcada como concluída
      expect(tasksRepository.save).toHaveBeenCalledWith(task);
    });

    it('should throw an error if the task is not found', async () => {
      const taskId = 999; // ID não existente
      jest.spyOn(tasksRepository, 'findOne').mockResolvedValue(null); // Simula não encontrar a tarefa

      await expect(service.markAsCompleted(taskId)).rejects.toThrow(
        'Task not found',
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const id = 1;
      jest
        .spyOn(tasksRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: {} });

      await service.deleteTask(id);
      expect(tasksRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw an error if task deletion fails', async () => {
      const id = 999;
      jest
        .spyOn(tasksRepository, 'delete')
        .mockResolvedValue({ affected: 0, raw: {} });
    });
  });
});
