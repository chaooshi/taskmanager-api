import { Column, Task } from 'generated/prisma';
import {
  ColumnResponseDto,
  ColumnWithTasksResponseDto,
  ColumnState,
} from '../column.dto';
import { mapToTaskResponseDto } from './task.mapper';

export function mapToColumnResponseDto(column: Column): ColumnResponseDto {
  return {
    id: column.id,
    state: column.state as ColumnState,
  };
}

export function mapToColumnWithTasksResponseDto(
  column: Column & { tasks: Task[] },
): ColumnWithTasksResponseDto {
  return {
    id: column.id,
    state: column.state as ColumnState,
    tasks: column.tasks.map(mapToTaskResponseDto),
  };
}
