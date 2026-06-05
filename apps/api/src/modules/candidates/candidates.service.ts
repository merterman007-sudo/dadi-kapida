import { randomUUID } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { buildCandidateCode } from "@dadi-kapida/utils";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCandidateDto } from "./dto/create-candidate.dto";
import { UpdateCandidateDto } from "./dto/update-candidate.dto";

type CandidateDetailPlacement = {
  id: string;
  family_id: string;
  family_request_id: string;
  family_name: string | null;
  family_request_title: string | null;
  status: string;
  start_date: Date;
  agreed_salary: Prisma.Decimal;
  service_fee: Prisma.Decimal | null;
  created_at: Date;
};

@Injectable()
export class CandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(page = 1, limit = 20, q?: string) {
    const where: Prisma.CandidateWhereInput = {
      deleted_at: null,
      ...(q
        ? {
            OR: [
              { candidate_code: { contains: q, mode: "insensitive" } },
              { first_name: { contains: q, mode: "insensitive" } },
              { last_name: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    };

    return this.prisma.candidate.findMany({
      where,
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });
  }

  async findOne(id: string) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { id, deleted_at: null }
    });

    if (!candidate) {
      throw new NotFoundException("Candidate not found");
    }

    const placements = await this.prisma.placement.findMany({
      where: { candidate_id: candidate.id },
      orderBy: { created_at: "desc" }
    });

    const [families, requests] = await Promise.all([
      placements.length > 0
        ? this.prisma.family.findMany({
            where: { id: { in: placements.map((placement) => placement.family_id) } },
            select: { id: true, family_name: true }
          })
        : Promise.resolve([]),
      placements.length > 0
        ? this.prisma.familyRequest.findMany({
            where: { id: { in: placements.map((placement) => placement.family_request_id) } },
            select: { id: true, title: true }
          })
        : Promise.resolve([])
    ]);

    const familyMap = new Map(families.map((family) => [family.id, family.family_name] as const));
    const requestMap = new Map(requests.map((request) => [request.id, request.title] as const));

    return {
      ...candidate,
      placements: placements.map((placement): CandidateDetailPlacement => ({
        id: placement.id,
        family_id: placement.family_id,
        family_request_id: placement.family_request_id,
        family_name: familyMap.get(placement.family_id) ?? null,
        family_request_title: requestMap.get(placement.family_request_id) ?? null,
        status: placement.status,
        start_date: placement.start_date,
        agreed_salary: placement.agreed_salary,
        service_fee: placement.service_fee,
        created_at: placement.created_at
      }))
    };
  }

  create(dto: CreateCandidateDto) {
    const id = randomUUID();
    return this.prisma.candidate.create({
      data: {
        id,
        candidate_code: buildCandidateCode(id),
        ...dto
      }
    });
  }

  async update(id: string, dto: UpdateCandidateDto) {
    await this.findOne(id);

    return this.prisma.candidate.update({
      where: { id },
      data: dto
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.candidate.update({
      where: { id },
      data: { deleted_at: new Date() }
    });

    return { success: true };
  }
}
