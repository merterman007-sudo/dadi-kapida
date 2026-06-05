import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { FamilyRequestStatus, type Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateFamilyRequestDto } from "./dto/create-family-request.dto";
import { UpdateFamilyRequestDto } from "./dto/update-family-request.dto";

const FAMILY_REQUEST_TRANSITIONS: Record<FamilyRequestStatus, FamilyRequestStatus[]> = {
  DRAFT: ["OPEN", "CANCELLED"],
  OPEN: ["MATCHING", "CANCELLED", "LOST"],
  MATCHING: ["SHORTLISTED", "CANCELLED", "LOST"],
  SHORTLISTED: ["INTERVIEWING", "MATCHING", "CANCELLED", "LOST"],
  INTERVIEWING: ["OFFER", "MATCHING", "CANCELLED", "LOST"],
  OFFER: ["PLACED", "INTERVIEWING", "CANCELLED", "LOST"],
  PLACED: [],
  CANCELLED: [],
  LOST: []
};

@Injectable()
export class FamilyRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(page = 1, limit = 20, q?: string) {
    const where: Prisma.FamilyRequestWhereInput = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
            { district: { contains: q, mode: "insensitive" } }
          ]
        }
      : {};

    return this.prisma.familyRequest.findMany({
      where,
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });
  }

  async findOne(id: string) {
    const familyRequest = await this.prisma.familyRequest.findUnique({
      where: { id }
    });

    if (!familyRequest) {
      throw new NotFoundException("Family request not found");
    }

    return familyRequest;
  }

  async create(dto: CreateFamilyRequestDto) {
    await this.assertFamilyExists(dto.family_id);

    return this.prisma.familyRequest.create({
      data: {
        ...dto,
        start_date: dto.start_date ? new Date(dto.start_date) : undefined,
        end_date: dto.end_date ? new Date(dto.end_date) : undefined
      }
    });
  }

  async update(id: string, dto: UpdateFamilyRequestDto) {
    const existing = await this.findOne(id);

    if (dto.family_id) {
      await this.assertFamilyExists(dto.family_id);
    }

    if (dto.status && dto.status !== existing.status) {
      const allowed = FAMILY_REQUEST_TRANSITIONS[existing.status];
      if (!allowed.includes(dto.status)) {
        throw new BadRequestException(
          `Invalid status transition: ${existing.status} -> ${dto.status}`
        );
      }
    }

    const updated = await this.prisma.familyRequest.update({
      where: { id },
      data: {
        ...dto,
        start_date: dto.start_date ? new Date(dto.start_date) : undefined,
        end_date: dto.end_date ? new Date(dto.end_date) : undefined
      }
    });

    if (dto.status && dto.status !== existing.status) {
      await this.createFollowupTaskForStatusChange(updated.id, dto.status, updated.owner_user_id);
    }

    return updated;
  }

  private async assertFamilyExists(familyId: string) {
    const family = await this.prisma.family.findFirst({
      where: { id: familyId, deleted_at: null },
      select: { id: true }
    });

    if (!family) {
      throw new NotFoundException("Family not found");
    }
  }

  private async createFollowupTaskForStatusChange(
    familyRequestId: string,
    status: FamilyRequestStatus,
    ownerUserId?: string | null
  ) {
    const followupTitleByStatus: Partial<Record<FamilyRequestStatus, string>> = {
      MATCHING: "Eşleştirme sonuçlarını kontrol et",
      SHORTLISTED: "Kısa listeyi aileye gönder",
      INTERVIEWING: "Görüşme çıktısını kaydet",
      OFFER: "Teklif onayı takibi yap"
    };

    const title = followupTitleByStatus[status];
    if (!title) {
      return;
    }

    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + 1);

    await this.prisma.task.create({
      data: {
        title,
        description: `Otomatik görev: Talep durumu ${status} oldu.`,
        status: "TODO",
        priority: 3,
        due_at: dueAt,
        assignee_user_id: ownerUserId ?? undefined,
        entity_type: "FAMILY_REQUEST",
        entity_id: familyRequestId,
        created_by_user_id: ownerUserId ?? undefined
      }
    });
  }
}
