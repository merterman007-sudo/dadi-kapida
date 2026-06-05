import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePlacementDto } from "./dto/create-placement.dto";
import { UpdatePlacementStatusDto } from "./dto/update-placement-status.dto";
import { UpdatePlacementDto } from "./dto/update-placement.dto";

@Injectable()
export class PlacementsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(page = 1, limit = 20, status?: string) {
    return this.prisma.placement.findMany({
      where: status ? { status: status as never } : undefined,
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });
  }

  async findOne(id: string) {
    const placement = await this.prisma.placement.findUnique({ where: { id } });
    if (!placement) {
      throw new NotFoundException("Placement not found");
    }
    return placement;
  }

  async create(dto: CreatePlacementDto, actorUserId?: string) {
    await this.assertReferences(dto.family_id, dto.family_request_id, dto.candidate_id);

    return this.prisma.placement.create({
      data: {
        ...dto,
        start_date: new Date(dto.start_date),
        guarantee_until: dto.guarantee_until ? new Date(dto.guarantee_until) : undefined,
        created_by_user_id: actorUserId
      }
    });
  }

  async update(id: string, dto: UpdatePlacementDto) {
    await this.findOne(id);
    return this.prisma.placement.update({
      where: { id },
      data: {
        ...dto,
        start_date: dto.start_date ? new Date(dto.start_date) : undefined,
        guarantee_until: dto.guarantee_until ? new Date(dto.guarantee_until) : undefined
      }
    });
  }

  async updateStatus(id: string, dto: UpdatePlacementStatusDto, actorUserId?: string) {
    const current = await this.findOne(id);

    const updated = await this.prisma.placement.update({
      where: { id },
      data: { status: dto.status }
    });

    await this.prisma.placementStatusHistory.create({
      data: {
        placement_id: id,
        old_status: current.status,
        new_status: dto.status,
        reason: dto.reason,
        changed_by_user_id: actorUserId
      }
    });

    return updated;
  }

  private async assertReferences(familyId: string, familyRequestId: string, candidateId: string) {
    const [family, request, candidate] = await Promise.all([
      this.prisma.family.findFirst({ where: { id: familyId, deleted_at: null }, select: { id: true } }),
      this.prisma.familyRequest.findUnique({ where: { id: familyRequestId }, select: { id: true } }),
      this.prisma.candidate.findFirst({ where: { id: candidateId, deleted_at: null }, select: { id: true } })
    ]);

    if (!family) {
      throw new NotFoundException("Family not found");
    }
    if (!request) {
      throw new NotFoundException("Family request not found");
    }
    if (!candidate) {
      throw new NotFoundException("Candidate not found");
    }
  }

  getStatus() {
    return { module: "placements", status: "ok" };
  }
}
