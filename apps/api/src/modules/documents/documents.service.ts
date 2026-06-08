import { Injectable, NotFoundException } from "@nestjs/common";
import { DocumentStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateCandidateDocumentDto } from "./dto/create-candidate-document.dto";
import { RejectCandidateDocumentDto } from "./dto/reject-candidate-document.dto";

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByCandidate(candidateId: string) {
    await this.assertCandidate(candidateId);
    return this.prisma.candidateDocument.findMany({
      where: { candidate_id: candidateId },
      orderBy: { created_at: "desc" }
    });
  }

  async createForCandidate(candidateId: string, dto: CreateCandidateDocumentDto) {
    await this.assertCandidate(candidateId);
    return this.prisma.candidateDocument.create({
      data: {
        ...dto,
        candidate_id: candidateId,
        expires_at: dto.expires_at ? new Date(dto.expires_at) : undefined
      }
    });
  }

  async verify(id: string, userId?: string) {
    await this.assertDocument(id);
    return this.prisma.candidateDocument.update({
      where: { id },
      data: {
        status: DocumentStatus.VERIFIED,
        verified_at: new Date(),
        verified_by: userId,
        reject_reason: null
      }
    });
  }

  async reject(id: string, dto: RejectCandidateDocumentDto) {
    await this.assertDocument(id);
    return this.prisma.candidateDocument.update({
      where: { id },
      data: {
        status: DocumentStatus.REJECTED,
        reject_reason: dto.reason
      }
    });
  }

  async remove(id: string) {
    await this.assertDocument(id);
    await this.prisma.candidateDocument.delete({ where: { id } });
    return { success: true };
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

  private async assertDocument(id: string) {
    const doc = await this.prisma.candidateDocument.findUnique({
      where: { id },
      select: { id: true }
    });
    if (!doc) {
      throw new NotFoundException("Candidate document not found");
    }
  }
}
