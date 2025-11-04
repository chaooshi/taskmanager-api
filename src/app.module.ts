import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { PrismaService } from './services/prisma.service';
import { UsersService } from './services/users.service';
import { TasksService } from './services/tasks.service';

import { TaskController } from './controllers/task.controller';
import { UserController } from './controllers/user.controller';
import { ColumnController } from './controllers/column.controller';
import { ColumnService } from './services/column.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    TaskController,
    UserController,
    ColumnController,
  ],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    TasksService,
    ColumnService,
  ],
})
export class AppModule {}
