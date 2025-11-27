import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from 'src/services/users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UserWithTasksResponseDto,
} from '../dto/user.dto';
import {
  mapToUserResponseDto,
  mapToUserWithTasksResponseDto,
} from '../dto/mappers/user.mapper';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  // Get all users
  @Get()
  async getUsers(): Promise<UserWithTasksResponseDto[]> {
    const users = await this.usersService.users({});
    return users.map(mapToUserWithTasksResponseDto);
  }

  // Get a single user by ID
  @Get(':id')
  async getUser(
    @Param('id') id: string,
  ): Promise<UserWithTasksResponseDto | null> {
    const user = await this.usersService.user({ id });
    return user ? mapToUserWithTasksResponseDto(user) : null;
  }

  // Create a new user
  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(data);
    return mapToUserResponseDto(user);
  }

  // Update a user
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.updateUser({ where: { id }, data });
    return mapToUserResponseDto(user);
  }

  // Delete a user
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.deleteUser({ id });
    return mapToUserResponseDto(user);
  }
}
