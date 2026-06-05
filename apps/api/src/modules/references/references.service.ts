import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCandidateReferenceDto } from "./dto/create-candidate-reference.dto";
import { CreateReferenceCheckDto } from "./dto/create-reference-check.dto";
import { UpdateCandidateReferenceDto } from "./dto/update-candidate-reference.dto";

@Injectable()
export class ReferencesService {
  constructor(private readonly prisma: PrismaService) {}

  async listCandidateReferences(candidateId: string) {
    await this.assertCandidate(candidateId);
    return this.prisma.candidateReference.findMany({
      where: { candidate_id: candidateId },
      orderBy: { created_at: "desc" }
    });
  }

  async createCandidateReference(candidateId: string, dto: CreateCandidateReferenceDto) {
    await this.assertCandidate(candidateId);
    return this.prisma.candidateReference.create({
      data: {
        ...dto,
        candidate_id: candidateId
      }
    });
  }

  async updateCandidateReference(referenceId: string, dto: UpdateCandidateReferenceDto) {
    await this.assertReference(referenceId);
    return this.prisma.candidateReference.update({
      where: { id: referenceId },
      data: dto
    });
  }

  async createReferenceCheck(
    referenceId: string,
    dto: CreateReferenceCheckDto,
    actorUserId?: string
  ) {
    await this.assertReference(referenceId);
    return this.prisma.referenceCheck.create({
      data: {
        candidate_reference_id: referenceId,
        checked_by_user_id: actorUserId,
        status: dto.status,
        score: dto.score,
        notes: dto.notes
      }
    });
  }

  async listReferenceChecks(referenceId: string) {
    await this.assertReference(referenceId);
    return this.prisma.referenceCheck.findMany({
      where: { candidate_reference_id: referenceId },
      orderBy: { created_at: "desc" }
    });
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

  private async assertReference(referenceId: string) {
    const reference = await this.prisma.candidateReference.findUnique({
      where: { id: referenceId },
      select: { id: true }
    });
    if (!reference) {
      throw new NotFoundException("Candidate reference not found");
    }
  }
}
