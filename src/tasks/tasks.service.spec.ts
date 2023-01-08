import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
});

const mockUser = {
  username: 'Ariel',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      tasksRepository.findAll.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const id = '3e229d1c-3667-480b-9560-d599dbecbb65';
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id,
        status: TaskStatus.OPEN,
      };

      tasksRepository.findById.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(id, mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findById and handles an error', async () => {
      tasksRepository.findById.mockResolvedValue(null);
      const id = '3e229d1c-3667-480b-9560-d599dbecbb65';
      expect(tasksService.getTaskById(id, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
