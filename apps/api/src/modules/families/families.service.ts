import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateFamilyDto } from "./dto/create-family.dto";
import { UpdateFamilyDto } from "./dto/update-family.dto";

@Injectable()
export class FamiliesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(page = 1, limit = 20, q?: string, status?: string) {
    const where: Prisma.FamilyWhereInput = {
      deleted_at: null,
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { family_name: { contains: q, mode: "insensitive" } },
              { primary_contact_name: { contains: q, mode: "insensitive" } },
              { primary_contact_phone: { contains: q, mode: "insensitive" } },
              { primary_contact_email: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    };

    return this.prisma.family.findMany({
      where,
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });
  }

  async findOne(id: string) {
    const family = await this.prisma.family.findFirst({
      where: { id, deleted_at: null }
    });

    if (!family) {
      throw new NotFoundException("Family not found");
    }

    return family;
  }

  create(dto: CreateFamilyDto) {
    return this.prisma.family.create({
      data: dto
    });
  }

  async update(id: string, dto: UpdateFamilyDto) {
    await this.findOne(id);

    return this.prisma.family.update({
      where: { id },
      data: dto
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.family.update({
      where: { id },
      data: { deleted_at: new Date() }
    });

    return { success: true };
  }
}
