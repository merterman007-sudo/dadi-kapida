import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import type { AuthenticatedUser } from "../../common/interfaces/authenticated-user.interface";
import { CreateCandidateReferenceDto } from "./dto/create-candidate-reference.dto";
import { CreateReferenceCheckDto } from "./dto/create-reference-check.dto";
import { UpdateCandidateReferenceDto } from "./dto/update-candidate-reference.dto";
import { ReferencesService } from "./references.service";

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReferencesController {
  constructor(private readonly service: ReferencesService) {}

  @Get("candidates/:id/references")
  @RequirePermissions("candidates.read")
  listCandidateReferences(@Param("id") candidateId: string) {
    return this.service.listCandidateReferences(candidateId);
  }

  @Post("candidates/:id/references")
  @RequirePermissions("candidates.update")
  createCandidateReference(
    @Param("id") candidateId: string,
    @Body() dto: CreateCandidateReferenceDto
  ) {
    return this.service.createCandidateReference(candidateId, dto);
  }

  @Patch("candidate-references/:id")
  @RequirePermissions("candidates.update")
  updateCandidateReference(
    @Param("id") referenceId: string,
    @Body() dto: UpdateCandidateReferenceDto
  ) {
    return this.service.updateCandidateReference(referenceId, dto);
  }

  @Post("candidate-references/:id/checks")
  @RequirePermissions("candidates.update")
  createReferenceCheck(
    @Param("id") referenceId: string,
    @Body() dto: CreateReferenceCheckDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.createReferenceCheck(referenceId, dto, user.id);
  }

  @Get("candidate-references/:id/checks")
  @RequirePermissions("candidates.read")
  listReferenceChecks(@Param("id") referenceId: string) {
    return this.service.listReferenceChecks(referenceId);
  }
}
