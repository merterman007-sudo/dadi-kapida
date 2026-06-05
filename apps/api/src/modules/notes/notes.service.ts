import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(entityType?: string, entityId?: string, page = 1, limit = 20) {
    return this.prisma.note.findMany({
      where: {
        ...(entityType ? { entity_type: entityType } : {}),
        ...(entityId ? { entity_id: entityId } : {})
      },
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: [{ pinned: "desc" }, { created_at: "desc" }]
    });
  }

  async findOne(id: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) {
      throw new NotFoundException("Note not found");
    }
    return note;
  }

  create(dto: CreateNoteDto, actorUserId?: string) {
    return this.prisma.note.create({
      data: {
        ...dto,
        created_by_user_id: actorUserId
      }
    });
  }

  async update(id: string, dto: UpdateNoteDto) {
    await this.findOne(id);
    return this.prisma.note.update({
      where: { id },
      data: dto
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.note.delete({ where: { id } });
    return { success: true };
  }

  async pin(id: string, pinned = true) {
    await this.findOne(id);
    return this.prisma.note.update({
      where: { id },
      data: { pinned }
    });
  }
}
