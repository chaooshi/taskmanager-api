import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Task, Prisma } from 'generated/prisma';
import { TasksService } from 'src/services/tasks.service';

@Controller('task')
export class TaskController {
  constructor(private readonly tasksService: TasksService) {}

  // Get a single task by unique identifier
  @Get(':id')
  async getTask(@Param('id') id: string): Promise<Task | null> {
    return this.tasksService.task({ id });
  }

  // Get multiple tasks with optional filters, pagination, and ordering
  @Get()
  async getTasks(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('cursor') cursor?: string,
    @Query('orderBy') orderBy?: Prisma.TaskOrderByWithRelationInput,
    @Query('where') where?: Prisma.TaskWhereInput,
  ): Promise<Task[]> {
    const cursorObj = cursor ? { id: cursor } : undefined;
    return this.tasksService.tasks({
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy,
    });
  }

  // Create a new task
  @Post()
  async createTask(@Body() data: Prisma.TaskCreateInput): Promise<Task> {
    return this.tasksService.createTask(data);
  }

  // Update an existing task
  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() data: Prisma.TaskUpdateInput,
  ): Promise<Task> {
    return this.tasksService.updateTask({ where: { id }, data });
  }

  // Delete a task
  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<Task> {
    return this.tasksService.deleteTask({ id });
  }

  // Reorder tasks within a column
  @Patch('reorder/:columnId')
  async reorderTasks(
    @Param('columnId') columnId: number,
    @Body('orderedTaskIds') orderedTaskIds: string[],
  ) {
    await this.tasksService.reorderTasks(columnId, orderedTaskIds);
    return { success: true };
  }

  // Bulk move tasks to another column
  @Patch('bulk-move')
  async bulkMoveTasks(
    @Body() body: { taskIds: string[]; targetColumnId: number },
  ) {
    await this.tasksService.bulkMoveTasks(body.taskIds, body.targetColumnId);
    return { success: true };
  }
}
