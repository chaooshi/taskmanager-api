import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Column, Prisma } from 'generated/prisma';

@Injectable()
export class ColumnService {
  constructor(private readonly prisma: PrismaService) {}

  async column(where: Prisma.ColumnWhereUniqueInput): Promise<Column | null> {
    return this.prisma.column.findUnique({
      where,
      include: { tasks: true },
    });
  }

  async columns(): Promise<Column[]> {
    return this.prisma.column.findMany({
      include: { tasks: true },
      orderBy: { id: 'asc' },
    });
  }

  async createColumn(data: Prisma.ColumnCreateInput): Promise<Column> {
    return this.prisma.column.create({
      data,
    });
  }

  async updateColumn(params: {
    where: Prisma.ColumnWhereUniqueInput;
    data: Prisma.ColumnUpdateInput;
  }): Promise<Column> {
    const { where, data } = params;
    return this.prisma.column.update({
      where,
      data,
    });
  }

  async deleteColumn(where: Prisma.ColumnWhereUniqueInput): Promise<Column> {
    return this.prisma.column.delete({
      where,
    });
  }
}
