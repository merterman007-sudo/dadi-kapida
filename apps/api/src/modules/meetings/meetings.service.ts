import { Injectable, NotFoundException } from "@nestjs/common";
import { MeetingStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateMeetingDto } from "./dto/create-meeting.dto";
import { UpdateMeetingDto } from "./dto/update-meeting.dto";

@Injectable()
export class MeetingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(page = 1, limit = 20, status?: string) {
    return this.prisma.meeting.findMany({
      where: status ? { status: status as never } : undefined,
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { starts_at: "desc" }
    });
  }

  async findOne(id: string) {
    const meeting = await this.prisma.meeting.findUnique({ where: { id } });
    if (!meeting) {
      throw new NotFoundException("Meeting not found");
    }
    return meeting;
  }

  create(dto: CreateMeetingDto, actorUserId?: string) {
    return this.prisma.meeting.create({
      data: {
        ...dto,
        starts_at: new Date(dto.starts_at),
        ends_at: dto.ends_at ? new Date(dto.ends_at) : undefined,
        created_by_user_id: actorUserId
      }
    });
  }

  async update(id: string, dto: UpdateMeetingDto) {
    await this.findOne(id);
    return this.prisma.meeting.update({
      where: { id },
      data: {
        ...dto,
        starts_at: dto.starts_at ? new Date(dto.starts_at) : undefined,
        ends_at: dto.ends_at ? new Date(dto.ends_at) : undefined
      }
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.meeting.delete({ where: { id } });
    return { success: true };
  }

  async complete(id: string) {
    await this.findOne(id);
    return this.prisma.meeting.update({
      where: { id },
      data: { status: MeetingStatus.COMPLETED }
    });
  }

  async cancel(id: string) {
    await this.findOne(id);
    return this.prisma.meeting.update({
      where: { id },
      data: { status: MeetingStatus.CANCELLED }
    });
  }
}
