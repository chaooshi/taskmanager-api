export class CreateTaskDto {
  title: string;
  description?: string;
  ownerId: string;
  columnId: number;
  order?: number;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  ownerId?: string;
  columnId?: number;
  order?: number;
}

export interface TaskResponseDto {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  columnId: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskWithOwnerResponseDto {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  columnId: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    email: string;
    name: string | null;
    lastName: string | null;
  };
}
