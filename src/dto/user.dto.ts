import { TaskResponseDto } from './task.dto';

export class CreateUserDto {
  email: string;
  name?: string;
  lastName?: string;
}

export class UpdateUserDto {
  email?: string;
  name?: string;
  lastName?: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
}

export interface UserWithTasksResponseDto {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  tasks: TaskResponseDto[];
}
