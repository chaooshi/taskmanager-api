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

import { ColumnService } from 'src/services/column.service';
import {
  CreateColumnDto,
  UpdateColumnDto,
  ColumnResponseDto,
  ColumnWithTasksResponseDto,
} from '../dto/column.dto';
import {
  mapToColumnResponseDto,
  mapToColumnWithTasksResponseDto,
} from '../dto/mappers/column.mapper';

@Controller('column')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  // Get all columns
  @Get()
  async getColumns(): Promise<ColumnWithTasksResponseDto[]> {
    const columns = await this.columnService.columns();
    return columns.map(mapToColumnWithTasksResponseDto);
  }

  // Get a single column by ID
  @Get(':id')
  async getColumn(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ColumnWithTasksResponseDto | null> {
    const column = await this.columnService.column({ id });
    return column ? mapToColumnWithTasksResponseDto(column) : null;
  }

  // Create a new column
  @Post()
  async createColumn(
    @Body() data: CreateColumnDto,
  ): Promise<ColumnResponseDto> {
    const column = await this.columnService.createColumn(data);
    return mapToColumnResponseDto(column);
  }

  // Update a column
  @Put(':id')
  async updateColumn(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateColumnDto,
  ): Promise<ColumnResponseDto> {
    const column = await this.columnService.updateColumn({
      where: { id },
      data,
    });
    return mapToColumnResponseDto(column);
  }

  // Delete a column
  @Delete(':id')
  async deleteColumn(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ColumnResponseDto> {
    const column = await this.columnService.deleteColumn({ id });
    return mapToColumnResponseDto(column);
  }
}
