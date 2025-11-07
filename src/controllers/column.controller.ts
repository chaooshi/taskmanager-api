import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';

import { Column, Prisma } from 'generated/prisma';
import { ColumnService } from 'src/services/column.service';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  // Get all columns
  @Get()
  async getColumns(): Promise<Column[]> {
    return this.columnService.columns();
  }

  // Get a single column by ID
  @Get(':id')
  async getColumn(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Column | null> {
    return this.columnService.column({ id });
  }

  // Create a new column
  @Post()
  async createColumn(@Body() data: Prisma.ColumnCreateInput): Promise<Column> {
    return this.columnService.createColumn(data);
  }

  // Update a column
  @Put(':id')
  async updateColumn(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.ColumnUpdateInput,
  ): Promise<Column> {
    return this.columnService.updateColumn({ where: { id }, data });
  }

  // Delete a column
  @Delete(':id')
  async deleteColumn(@Param('id', ParseIntPipe) id: number): Promise<Column> {
    return this.columnService.deleteColumn({ id });
  }
}
