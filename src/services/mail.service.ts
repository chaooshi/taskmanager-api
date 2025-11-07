// mail.service.ts
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Task } from 'generated/prisma';
import { PrismaService } from './prisma.service';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly prisma: PrismaService,
  ) {}

  async sendTaskCompletionEmail(task: Task) {
    if (!task.ownerId) return;

    const owner = await this.prisma.user.findUnique({
      where: { id: task.ownerId },
    });
    if (!owner?.email) return;

    await this.mailerService.sendMail({
      to: owner.email,
      subject: `Task "${task.title}" completed!`,
      text: `Good job! Your task "${task.title}" has been marked as completed.`,
    });
  }
}
