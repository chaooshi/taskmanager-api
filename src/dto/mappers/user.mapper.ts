import { User, Task } from 'generated/prisma';
import { UserResponseDto, UserWithTasksResponseDto } from '../user.dto';
import { mapToTaskResponseDto } from './task.mapper';

export function mapToUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    lastName: user.lastName,
  };
}

export function mapToUserWithTasksResponseDto(
  user: User & { tasks: Task[] },
): UserWithTasksResponseDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    lastName: user.lastName,
    tasks: user.tasks.map(mapToTaskResponseDto),
  };
}
