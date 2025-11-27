import { TaskResponseDto } from './task.dto';

export type ColumnState = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export class CreateColumnDto {
  state: ColumnState;
}

export class UpdateColumnDto {
  state?: ColumnState;
}

export interface ColumnResponseDto {
  id: number;
  state: ColumnState;
}

export interface ColumnWithTasksResponseDto {
  id: number;
  state: ColumnState;
  tasks: TaskResponseDto[];
}
