import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import type { AuthenticatedUser } from "../../common/interfaces/authenticated-user.interface";
import { CreateCandidateDocumentDto } from "./dto/create-candidate-document.dto";
import { RejectCandidateDocumentDto } from "./dto/reject-candidate-document.dto";
import { DocumentsService } from "./documents.service";

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  @Get("candidates/:id/documents")
  @RequirePermissions("candidates.read")
  listCandidateDocuments(@Param("id") candidateId: string) {
    return this.service.listByCandidate(candidateId);
  }

  @Post("candidates/:id/documents")
  @RequirePermissions("candidates.update")
  createCandidateDocument(
    @Param("id") candidateId: string,
    @Body() dto: CreateCandidateDocumentDto
  ) {
    return this.service.createForCandidate(candidateId, dto);
  }

  @Patch("candidate-documents/:id/verify")
  @RequirePermissions("candidates.update")
  verifyDocument(
    @Param("id") candidateDocumentId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.verify(candidateDocumentId, user.id);
  }

  @Patch("candidate-documents/:id/reject")
  @RequirePermissions("candidates.update")
  rejectDocument(
    @Param("id") candidateDocumentId: string,
    @Body() dto: RejectCandidateDocumentDto
  ) {
    return this.service.reject(candidateDocumentId, dto);
  }

  @Delete("candidate-documents/:id")
  @RequirePermissions("candidates.update")
  removeDocument(@Param("id") candidateDocumentId: string) {
    return this.service.remove(candidateDocumentId);
  }
}
