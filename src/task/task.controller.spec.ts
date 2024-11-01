import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './task.controller';
import { TasksService } from './task.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            findAll: jest.fn(),
            createTask: jest.fn(),
            markAsCompleted: jest.fn(),
            deleteTask: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const result = [new Task()];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a task and return it', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Task description',
        userEmail: 'jefferson.meira@teste.com.br',
      };
      const task = new Task();
      task.id = 1;
      jest.spyOn(service, 'createTask').mockResolvedValue(task);

      expect(await controller.create(createTaskDto)).toBe(task);
      expect(service.createTask).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('markAsCompleted', () => {
    it('should mark a task as completed', async () => {
      const taskId = 1;
      const task = new Task();
      task.id = taskId;
      task.isCompleted = false;

      jest
        .spyOn(service, 'markAsCompleted')
        .mockResolvedValue({ ...task, isCompleted: true });

      const result = await controller.markAsCompleted(taskId);
      expect(result.isCompleted).toBe(true);
      expect(service.markAsCompleted).toHaveBeenCalledWith(taskId);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const id = 1;
      jest.spyOn(service, 'deleteTask').mockResolvedValue();

      await controller.deleteTask(id);
      expect(service.deleteTask).toHaveBeenCalledWith(id);
    });

    it('should throw an error if task deletion fails', async () => {
      const id = 999;
      jest
        .spyOn(service, 'deleteTask')
        .mockRejectedValue(
          new HttpException('Erro ao excluir tarefa', HttpStatus.NOT_FOUND),
        );

      await expect(controller.deleteTask(id)).rejects.toThrow(HttpException);
      await expect(controller.deleteTask(id)).rejects.toThrow(
        'Erro ao excluir tarefa',
      );
    });
  });
});
