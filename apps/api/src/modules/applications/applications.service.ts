import { randomUUID } from "node:crypto";
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { buildCandidateCode } from "@dadi-kapida/utils";
import {
  CandidateApplicationStatus,
  CandidateStatus,
  Prisma
} from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { PublicApplicationCreateDto } from "./dto/public-application-create.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPublicApplication(
    payload: PublicApplicationCreateDto,
    rawPayload: unknown
  ) {
    this.assertBasicSpamProtection(payload);

    const duplicateWindowStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const hasRecentDuplicate = await this.prisma.candidateApplication.findFirst({
      where: {
        phone: payload.phone,
        created_at: { gte: duplicateWindowStart }
      }
    });

    const status = hasRecentDuplicate
      ? CandidateApplicationStatus.DUPLICATE
      : CandidateApplicationStatus.NEW;

    const created = await this.prisma.candidateApplication.create({
      data: {
        ...payload,
        birth_date: payload.birth_date ? new Date(payload.birth_date) : undefined,
        raw_payload: rawPayload as Prisma.InputJsonValue,
        status
      }
    });

    return created;
  }

  findAll(page = 1, limit = 20) {
    return this.prisma.candidateApplication.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" }
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.candidateApplication.findUnique({
      where: { id }
    });
    if (!application) {
      throw new NotFoundException("Application not found");
    }

    return application;
  }

  async update(id: string, dto: UpdateApplicationDto) {
    await this.findOne(id);
    return this.prisma.candidateApplication.update({
      where: { id },
      data: dto
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.candidateApplication.delete({ where: { id } });
    return { success: true };
  }

  async reject(id: string) {
    return this.update(id, { status: CandidateApplicationStatus.REJECTED });
  }

  async markDuplicate(id: string) {
    return this.update(id, { status: CandidateApplicationStatus.DUPLICATE });
  }

  async convertToCandidate(id: string, actorUserId?: string) {
    const application = await this.findOne(id);
    if (application.status === CandidateApplicationStatus.CONVERTED_TO_CANDIDATE) {
      throw new BadRequestException("Application already converted");
    }

    const candidateId = randomUUID();
    const candidate = await this.prisma.candidate.create({
      data: {
        id: candidateId,
        candidate_code: buildCandidateCode(candidateId),
        first_name: application.first_name,
        last_name: application.last_name,
        phone: application.phone,
        email: application.email,
        birth_date: application.birth_date,
        city: application.city,
        district: application.district,
        applied_position: application.applied_position,
        years_of_experience: application.experience_years,
        expected_salary_min: application.expected_salary_min,
        expected_salary_max: application.expected_salary_max,
        has_first_aid_certificate: application.has_first_aid_certificate ?? false,
        smoking_status: application.smoking_status,
        status: CandidateStatus.NEW,
        source: application.source,
        owner_user_id: actorUserId
      }
    });

    if (application.work_type_preference) {
      await this.prisma.candidateWorkPreference.create({
        data: {
          candidate_id: candidate.id,
          work_type: application.work_type_preference,
          can_live_in: application.can_live_in ?? false,
          min_salary: application.expected_salary_min ?? undefined,
          max_salary: application.expected_salary_max ?? undefined
        }
      });
    }

    await this.prisma.candidateApplication.update({
      where: { id },
      data: {
        status: CandidateApplicationStatus.CONVERTED_TO_CANDIDATE,
        candidate_id: candidate.id
      }
    });

    await this.prisma.auditLog.create({
      data: {
        actor_user_id: actorUserId,
        action: "application.convert_to_candidate",
        entity_type: "CandidateApplication",
        entity_id: id,
        metadata: {
          candidateId: candidate.id
        }
      }
    });

    return {
      candidate,
      applicationId: id
    };
  }

  private assertBasicSpamProtection(payload: PublicApplicationCreateDto): void {
    const suspiciousText = `${payload.first_name} ${payload.last_name} ${payload.notes ?? ""}`.toLowerCase();
    if (suspiciousText.includes("http://") || suspiciousText.includes("https://")) {
      throw new BadRequestException("Suspicious payload detected");
    }
  }
}
