import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { TasksService } from 'src/services/tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponseDto,
  TaskWithOwnerResponseDto,
} from '../dto/task.dto';
import {
  mapToTaskResponseDto,
  mapToTaskWithOwnerResponseDto,
} from '../dto/mappers/task.mapper';

@Controller('task')
export class TaskController {
  constructor(private readonly tasksService: TasksService) {}

  // Get a single task by unique identifier
  @Get(':id')
  async getTask(
    @Param('id') id: string,
  ): Promise<TaskWithOwnerResponseDto | null> {
    const task = await this.tasksService.task({ id });
    return task ? mapToTaskWithOwnerResponseDto(task) : null;
  }

  // Get multiple tasks with optional filters, pagination, and ordering
  @Get()
  async getTasks(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('cursor') cursor?: string,
    @Query('orderBy') orderBy?: Prisma.TaskOrderByWithRelationInput,
    @Query('where') where?: Prisma.TaskWhereInput,
  ): Promise<TaskWithOwnerResponseDto[]> {
    const cursorObj = cursor ? { id: cursor } : undefined;
    const tasks = await this.tasksService.tasks({
      skip,
      take,
      cursor: cursorObj,
      where,
      orderBy,
    });
    return tasks.map(mapToTaskWithOwnerResponseDto);
  }

  // Create a new task
  @Post()
  async createTask(@Body() data: CreateTaskDto): Promise<TaskResponseDto> {
    const task = await this.tasksService.createTask(data);
    return mapToTaskResponseDto(task);
  }

  // Update an existing task
  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() data: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const updateData: Prisma.TaskUpdateInput = {
      title: data.title,
      description: data.description,
      order: data.order,
    };

    if (data.ownerId) {
      updateData.owner = { connect: { id: data.ownerId } };
    }

    if (data.columnId !== undefined) {
      updateData.column = { connect: { id: data.columnId } };
    }

    const task = await this.tasksService.updateTask({
      where: { id },
      data: updateData,
    });
    return mapToTaskResponseDto(task);
  }

  // Delete a task
  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<TaskResponseDto> {
    const task = await this.tasksService.deleteTask({ id });
    return mapToTaskResponseDto(task);
  }

  // Reorder tasks within a column
  @Put('reorder/:columnId')
  async reorderTasks(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body('orderedTaskIds') orderedTaskIds: string[],
  ) {
    await this.tasksService.reorderTasks(columnId, orderedTaskIds);
    return { success: true };
  }

  // Bulk move tasks to another column
  @Put('actions/bulk-move')
  async bulkMoveTasks(
    @Body() body: { taskIds: string[]; targetColumnId: number },
  ) {
    await this.tasksService.bulkMoveTasks(body.taskIds, body.targetColumnId);
    return { success: true };
  }
}
