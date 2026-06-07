import { randomUUID } from "node:crypto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { buildCandidateCode } from "@dadi-kapida/utils";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCandidateExperienceDto } from "./dto/create-candidate-experience.dto";
import { CreateCandidateLanguageDto } from "./dto/create-candidate-language.dto";
import { CreateCandidateWorkPreferenceDto } from "./dto/create-candidate-work-preference.dto";
import { CreateCandidateDto } from "./dto/create-candidate.dto";
import { UpdateCandidateExperienceDto } from "./dto/update-candidate-experience.dto";
import { UpdateCandidateLanguageDto } from "./dto/update-candidate-language.dto";
import { UpdateCandidateWorkPreferenceDto } from "./dto/update-candidate-work-preference.dto";
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

    const [
      workPreferences,
      languages,
      experiences,
      references,
      documents,
      families,
      requests
    ] = await Promise.all([
      this.prisma.candidateWorkPreference.findMany({
        where: { candidate_id: candidate.id },
        orderBy: { created_at: "desc" }
      }),
      this.prisma.candidateLanguage.findMany({
        where: { candidate_id: candidate.id },
        orderBy: { created_at: "desc" }
      }),
      this.prisma.candidateExperience.findMany({
        where: { candidate_id: candidate.id },
        orderBy: { created_at: "desc" }
      }),
      this.prisma.candidateReference.findMany({
        where: { candidate_id: candidate.id },
        orderBy: { created_at: "desc" }
      }),
      this.prisma.candidateDocument.findMany({
        where: { candidate_id: candidate.id },
        orderBy: { created_at: "desc" }
      }),
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
      work_preferences: workPreferences,
      languages,
      experiences,
      references,
      documents,
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
    const candidateData = this.mapCandidateData(dto) as Omit<
      Prisma.CandidateUncheckedCreateInput,
      "id" | "candidate_code"
    >;
    return this.prisma.candidate.create({
      data: {
        id,
        candidate_code: buildCandidateCode(id),
        ...candidateData
      }
    });
  }

  async update(id: string, dto: UpdateCandidateDto) {
    await this.findOne(id);

    return this.prisma.candidate.update({
      where: { id },
      data: this.mapCandidateData(dto)
    });
  }

  listAvailableLanguages() {
    return this.prisma.language.findMany({
      orderBy: { name: "asc" }
    });
  }

  listWorkPreferences(candidateId: string) {
    return this.assertCandidate(candidateId).then(() =>
      this.prisma.candidateWorkPreference.findMany({
        where: { candidate_id: candidateId },
        orderBy: { created_at: "desc" }
      })
    );
  }

  listExperiences(candidateId: string) {
    return this.assertCandidate(candidateId).then(() =>
      this.prisma.candidateExperience.findMany({
        where: { candidate_id: candidateId },
        orderBy: { created_at: "desc" }
      })
    );
  }

  createWorkPreference(candidateId: string, dto: CreateCandidateWorkPreferenceDto) {
    return this.assertCandidate(candidateId).then(() =>
      this.prisma.candidateWorkPreference.create({
        data: {
          candidate_id: candidateId,
          work_type: dto.work_type,
          can_live_in: dto.can_live_in ?? false,
          night_shift_ok: dto.night_shift_ok ?? false,
          weekend_ok: dto.weekend_ok ?? false,
          min_salary: dto.min_salary,
          max_salary: dto.max_salary
        }
      })
    );
  }

  async updateWorkPreference(id: string, dto: UpdateCandidateWorkPreferenceDto) {
    await this.assertWorkPreference(id);
    return this.prisma.candidateWorkPreference.update({
      where: { id },
      data: dto
    });
  }

  async removeWorkPreference(id: string) {
    await this.assertWorkPreference(id);
    await this.prisma.candidateWorkPreference.delete({
      where: { id }
    });
    return { success: true };
  }

  listLanguages(candidateId: string) {
    return this.assertCandidate(candidateId).then(() =>
      this.prisma.candidateLanguage.findMany({
        where: { candidate_id: candidateId },
        orderBy: { created_at: "desc" }
      })
    );
  }

  createExperience(candidateId: string, dto: CreateCandidateExperienceDto) {
    return this.assertCandidate(candidateId).then(() =>
      this.prisma.candidateExperience.create({
        data: {
          candidate_id: candidateId,
          title: dto.title,
          description: dto.description,
          age_group_experience: dto.age_group_experience,
          years: dto.years,
          start_date: dto.start_date ? new Date(dto.start_date) : undefined,
          end_date: dto.end_date ? new Date(dto.end_date) : undefined
        }
      })
    );
  }

  async updateExperience(id: string, dto: UpdateCandidateExperienceDto) {
    await this.assertExperience(id);
    return this.prisma.candidateExperience.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.age_group_experience !== undefined
          ? { age_group_experience: dto.age_group_experience }
          : {}),
        ...(dto.years !== undefined ? { years: dto.years } : {}),
        ...(dto.start_date !== undefined
          ? { start_date: dto.start_date ? new Date(dto.start_date) : null }
          : {}),
        ...(dto.end_date !== undefined
          ? { end_date: dto.end_date ? new Date(dto.end_date) : null }
          : {})
      }
    });
  }

  async removeExperience(id: string) {
    await this.assertExperience(id);
    await this.prisma.candidateExperience.delete({
      where: { id }
    });
    return { success: true };
  }

  createLanguage(candidateId: string, dto: CreateCandidateLanguageDto) {
    return this.assertCandidate(candidateId).then(() =>
      this.prisma.candidateLanguage.create({
        data: {
          candidate_id: candidateId,
          language_id: dto.language_id,
          level: dto.level
        }
      })
    );
  }

  async updateLanguage(id: string, dto: UpdateCandidateLanguageDto) {
    await this.assertLanguage(id);
    return this.prisma.candidateLanguage.update({
      where: { id },
      data: dto
    });
  }

  async removeLanguage(id: string) {
    await this.assertLanguage(id);
    await this.prisma.candidateLanguage.delete({
      where: { id }
    });
    return { success: true };
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.candidate.update({
      where: { id },
      data: { deleted_at: new Date() }
    });

    return { success: true };
  }

  private mapCandidateData(dto: CreateCandidateDto | UpdateCandidateDto) {
    return {
      ...(dto.first_name !== undefined ? { first_name: dto.first_name } : {}),
      ...(dto.last_name !== undefined ? { last_name: dto.last_name } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
      ...(dto.email !== undefined ? { email: dto.email } : {}),
      ...(dto.birth_date !== undefined
        ? { birth_date: dto.birth_date ? new Date(dto.birth_date) : null }
        : {}),
      ...(dto.available_from !== undefined
        ? { available_from: dto.available_from ? new Date(dto.available_from) : null }
        : {}),
      ...(dto.city !== undefined ? { city: dto.city } : {}),
      ...(dto.district !== undefined ? { district: dto.district } : {}),
      ...(dto.address !== undefined ? { address: dto.address } : {}),
      ...(dto.preferred_cities !== undefined ? { preferred_cities: dto.preferred_cities } : {}),
      ...(dto.education_level !== undefined ? { education_level: dto.education_level } : {}),
      ...(dto.years_of_experience !== undefined
        ? { years_of_experience: dto.years_of_experience }
        : {}),
      ...(dto.expected_salary_min !== undefined
        ? { expected_salary_min: dto.expected_salary_min }
        : {}),
      ...(dto.expected_salary_max !== undefined
        ? { expected_salary_max: dto.expected_salary_max }
        : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.source !== undefined ? { source: dto.source } : {}),
      ...(dto.has_first_aid_certificate !== undefined
        ? { has_first_aid_certificate: dto.has_first_aid_certificate }
        : {}),
      ...(dto.availability_status !== undefined
        ? { availability_status: dto.availability_status }
        : {}),
      ...(dto.smoking_status !== undefined ? { smoking_status: dto.smoking_status } : {})
    };
  }

  private async assertCandidate(candidateId: string) {
    const candidate = await this.prisma.candidate.findFirst({
      where: { id: candidateId, deleted_at: null },
      select: { id: true }
    });
    if (!candidate) {
      throw new NotFoundException("Candidate not found");
    }
  }

  private async assertWorkPreference(id: string) {
    const preference = await this.prisma.candidateWorkPreference.findUnique({
      where: { id },
      select: { id: true }
    });
    if (!preference) {
      throw new NotFoundException("Candidate work preference not found");
    }
  }

  private async assertLanguage(id: string) {
    const language = await this.prisma.candidateLanguage.findUnique({
      where: { id },
      select: { id: true }
    });
    if (!language) {
      throw new NotFoundException("Candidate language not found");
    }
  }

  private async assertExperience(id: string) {
    const experience = await this.prisma.candidateExperience.findUnique({
      where: { id },
      select: { id: true }
    });
    if (!experience) {
      throw new NotFoundException("Candidate experience not found");
    }
  }
}
