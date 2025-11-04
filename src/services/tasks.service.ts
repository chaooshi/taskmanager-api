import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Task, Prisma } from 'generated/prisma';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async task(
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput,
  ): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: taskWhereUniqueInput,
      include: { owner: true },
    });
  }

  async tasks(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
  }): Promise<Task[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.task.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { owner: true },
    });
  }

  async createTask(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    // find last order number in this column
    const lastTask = await this.prisma.task.findFirst({
      where: { columnId: data.columnId },
      orderBy: { order: 'desc' },
    });

    const nextOrder = (lastTask?.order ?? 0) + 1;

    return this.prisma.task.create({
      data: {
        ...data,
        order: nextOrder,
      },
    });
  }

  async updateTask(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.TaskUpdateInput;
  }): Promise<Task> {
    const { where, data } = params;
    return this.prisma.task.update({
      where,
      data,
    });
  }

  async deleteTask(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    return this.prisma.task.delete({
      where,
    });
  }

  async reorderTasks(columnId: number, orderedTaskIds: string[]) {
    // ensure all tasks belong to same column
    const tasks = await this.prisma.task.findMany({
      where: { id: { in: orderedTaskIds } },
      select: { id: true, columnId: true },
    });

    if (tasks.some((task) => task.columnId !== columnId)) {
      throw new Error('Some tasks do not belong to the given column.');
    }

    for (let i = 0; i < orderedTaskIds.length; i++) {
      await this.prisma.task.update({
        where: { id: orderedTaskIds[i] },
        data: { order: i + 1 },
      });
    }
  }

  async bulkMoveTasks(taskIds: string[], targetColumnId: number) {
    if (taskIds.length === 0) return;

    // Fetch tasks to move
    const tasksToMove = await this.prisma.task.findMany({
      where: { id: { in: taskIds } },
      select: { id: true, columnId: true, order: true },
      orderBy: { order: 'asc' },
    });

    if (tasksToMove.length === 0) return;

    // Find last order in destination column
    const lastTaskInDest = await this.prisma.task.findFirst({
      where: { columnId: targetColumnId },
      orderBy: { order: 'desc' },
    });
    let nextOrder = (lastTaskInDest?.order ?? 0) + 1;

    // Move tasks to destination column
    for (const task of tasksToMove) {
      await this.prisma.task.update({
        where: { id: task.id },
        data: { columnId: targetColumnId, order: nextOrder },
      });
      nextOrder++;
    }
  }
}
