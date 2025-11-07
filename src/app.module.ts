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
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './services/mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILTRAP_HOST,
        port: Number(process.env.MAILTRAP_PORT) || 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      },
      defaults: {
        from: process.env.DEFAULT_FROM,
      },
    }),
  ],
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
    MailService,
  ],
})
export class AppModule {}
