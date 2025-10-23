import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { TasksService } from './tasks.service';
import { User as UserModel, Task as TaskModel } from 'generated/prisma';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UsersService,
    private readonly taskService: TasksService,
  ) {}

  // ===== Task Endpoints =====

  @Get('task/:id')
  async getTaskById(@Param('id') id: string): Promise<TaskModel | null> {
    return this.taskService.task({ id: Number(id) });
  }

  @Get('tasks')
  async getPublishedTasks(): Promise<TaskModel[]> {
    return this.taskService.tasks({
      where: { published: true },
    });
  }

  @Get('filtered-tasks/:searchString')
  async getFilteredTasks(
    @Param('searchString') searchString: string,
  ): Promise<TaskModel[]> {
    return this.taskService.tasks({
      where: {
        OR: [
          { title: { contains: searchString } },
          { content: { contains: searchString } },
        ],
      },
    });
  }

  @Post('task')
  async createTask(
    @Body() taskData: { title: string; content?: string; authorEmail: string },
  ): Promise<TaskModel> {
    const { title, content, authorEmail } = taskData;
    return this.taskService.createTask({
      title,
      content,
      author: {
        connect: { email: authorEmail },
      },
    });
  }

  @Put('publish/:id')
  async publishTask(@Param('id') id: string): Promise<TaskModel> {
    return this.taskService.updateTask({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Delete('task/:id')
  async deleteTask(@Param('id') id: string): Promise<TaskModel> {
    return this.taskService.deleteTask({ id: Number(id) });
  }

  // ===== User Endpoints =====

  @Post('user')
  async createUser(
    @Body() userData: { name?: string; lastName?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel | null> {
    return this.userService.user({ id: Number(id) });
  }
}
