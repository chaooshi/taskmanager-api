import { Task, User } from 'generated/prisma';
import { TaskResponseDto, TaskWithOwnerResponseDto } from '../task.dto';

export function mapToTaskResponseDto(task: Task): TaskResponseDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    ownerId: task.ownerId,
    columnId: task.columnId,
    order: task.order,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export function mapToTaskWithOwnerResponseDto(
  task: Task & { owner: User },
): TaskWithOwnerResponseDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    ownerId: task.ownerId,
    columnId: task.columnId,
    order: task.order,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    owner: {
      id: task.owner.id,
      email: task.owner.email,
      name: task.owner.name,
      lastName: task.owner.lastName,
    },
  };
}
