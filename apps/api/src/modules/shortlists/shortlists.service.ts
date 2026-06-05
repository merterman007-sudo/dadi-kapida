import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { FamilyRequestStatus, MatchStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { AddShortlistItemDto } from "./dto/add-shortlist-item.dto";
import { CreateShortlistDto } from "./dto/create-shortlist.dto";
import { UpdateShortlistDto } from "./dto/update-shortlist.dto";
import { UpdateShortlistItemDto } from "./dto/update-shortlist-item.dto";

@Injectable()
export class ShortlistsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(page = 1, limit = 20, familyRequestId?: string) {
    return this.prisma.shortlist.findMany({
      where: familyRequestId ? { family_request_id: familyRequestId } : {},
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });
  }

  async findOne(id: string) {
    const shortlist = await this.prisma.shortlist.findUnique({
      where: { id }
    });
    if (!shortlist) {
      throw new NotFoundException("Shortlist not found");
    }

    const items = await this.prisma.shortlistItem.findMany({
      where: { shortlist_id: id },
      orderBy: { created_at: "asc" }
    });
    const candidateIds = [...new Set(items.map((item) => item.candidate_id))];
    const candidates =
      candidateIds.length > 0
        ? await this.prisma.candidate.findMany({
            where: { id: { in: candidateIds } },
            select: {
              id: true,
              first_name: true,
              last_name: true,
              phone: true,
              city: true,
              district: true,
              status: true
            }
          })
        : [];
    const candidateMap = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    return {
      ...shortlist,
      items: items.map((item) => ({
        ...item,
        candidate: candidateMap.get(item.candidate_id) ?? null
      }))
    };
  }

  async create(dto: CreateShortlistDto, actorUserId?: string) {
    await this.ensureFamilyRequestExists(dto.family_request_id);
    return this.prisma.shortlist.create({
      data: {
        family_request_id: dto.family_request_id,
        title: dto.title,
        notes: dto.notes,
        created_by_user_id: actorUserId
      }
    });
  }

  async update(id: string, dto: UpdateShortlistDto) {
    await this.findOne(id);
    return this.prisma.shortlist.update({
      where: { id },
      data: dto
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.$transaction([
      this.prisma.shortlistItem.deleteMany({
        where: { shortlist_id: id }
      }),
      this.prisma.shortlist.delete({
        where: { id }
      })
    ]);
    return { success: true };
  }

  async addItem(shortlistId: string, dto: AddShortlistItemDto) {
    const shortlist = await this.prisma.shortlist.findUnique({
      where: { id: shortlistId }
    });
    if (!shortlist) {
      throw new NotFoundException("Shortlist not found");
    }

    const candidate = await this.prisma.candidate.findFirst({
      where: { id: dto.candidate_id, deleted_at: null },
      select: { id: true }
    });
    if (!candidate) {
      throw new NotFoundException("Candidate not found");
    }

    try {
      const created = await this.prisma.shortlistItem.create({
        data: {
          shortlist_id: shortlistId,
          candidate_id: dto.candidate_id,
          consultant_note: dto.consultant_note
        }
      });

      await this.prisma.candidateMatch.updateMany({
        where: {
          family_request_id: shortlist.family_request_id,
          candidate_id: dto.candidate_id
        },
        data: { status: MatchStatus.SHORTLISTED }
      });

      await this.prisma.familyRequest.update({
        where: { id: shortlist.family_request_id },
        data: { status: FamilyRequestStatus.SHORTLISTED }
      });

      return created;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Candidate already exists in shortlist");
      }
      throw error;
    }
  }

  async updateItem(itemId: string, dto: UpdateShortlistItemDto) {
    await this.ensureShortlistItemExists(itemId);
    return this.prisma.shortlistItem.update({
      where: { id: itemId },
      data: {
        consultant_note: dto.consultant_note,
        family_feedback: dto.family_feedback,
        sent_to_family_at: dto.sent_to_family ? new Date() : undefined
      }
    });
  }

  async removeItem(itemId: string) {
    await this.ensureShortlistItemExists(itemId);
    await this.prisma.shortlistItem.delete({
      where: { id: itemId }
    });
    return { success: true };
  }

  private async ensureFamilyRequestExists(familyRequestId: string) {
    const request = await this.prisma.familyRequest.findUnique({
      where: { id: familyRequestId },
      select: { id: true }
    });
    if (!request) {
      throw new NotFoundException("Family request not found");
    }
  }

  private async ensureShortlistItemExists(itemId: string) {
    const item = await this.prisma.shortlistItem.findUnique({
      where: { id: itemId },
      select: { id: true }
    });
    if (!item) {
      throw new NotFoundException("Shortlist item not found");
    }
  }
}
