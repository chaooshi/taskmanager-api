import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User, Prisma } from 'generated/prisma';
import { UsersService } from 'src/services/users.service';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  // Get all users
  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.users({});
  }

  // Get a single user by ID
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User | null> {
    return this.usersService.user({ id });
  }

  // Create a new user
  @Post()
  async createUser(@Body() data: Prisma.UserCreateInput): Promise<User> {
    return this.usersService.createUser(data);
  }

  // Update a user
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.usersService.updateUser({ where: { id }, data });
  }

  // Delete a user
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.deleteUser({ id });
  }
}
