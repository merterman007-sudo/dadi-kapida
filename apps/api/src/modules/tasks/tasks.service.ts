import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(page = 1, limit = 20, status?: string) {
    return this.prisma.task.findMany({
      where: status ? { status: status as never } : undefined,
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });
  }

  findMy(userId: string, page = 1, limit = 20) {
    return this.prisma.task.findMany({
      where: { assignee_user_id: userId },
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException("Task not found");
    }
    return task;
  }

  create(dto: CreateTaskDto, actorUserId?: string) {
    return this.prisma.task.create({
      data: {
        ...dto,
        due_at: dto.due_at ? new Date(dto.due_at) : undefined,
        created_by_user_id: actorUserId
      }
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        due_at: dto.due_at ? new Date(dto.due_at) : undefined
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
    return { success: true };
  }

  async complete(id: string) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: { status: "DONE" }
    });
  }

  async reopen(id: string) {
    await this.findOne(id);
    return this.prisma.task.update({
      where: { id },
      data: { status: "TODO" }
    });
  }
}
