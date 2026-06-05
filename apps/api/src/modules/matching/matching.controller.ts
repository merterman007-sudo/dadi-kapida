import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import type { AuthenticatedUser } from "../../common/interfaces/authenticated-user.interface";
import { UpdateCandidateMatchStatusDto } from "./dto/update-candidate-match-status.dto";
import { MatchingService } from "./matching.service";

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MatchingController {
  constructor(private readonly service: MatchingService) {}

  @Post("family-requests/:id/run-matching")
  @RequirePermissions("matching.run")
  runMatching(
    @Param("id") familyRequestId: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.runForFamilyRequest(familyRequestId, user.id);
  }

  @Get("match-runs/:id")
  @RequirePermissions("matching.read")
  getRun(@Param("id") runId: string) {
    return this.service.getRun(runId);
  }

  @Get("family-requests/:id/matches")
  @RequirePermissions("matching.read")
  getLatestFamilyRequestMatches(@Param("id") familyRequestId: string) {
    return this.service.getLatestRunForFamilyRequest(familyRequestId);
  }

  @Get("match-runs/:id/results")
  @RequirePermissions("matching.read")
  getRunResults(@Param("id") runId: string) {
    return this.service.getRunResults(runId);
  }

  @Get("candidate-matches/:id")
  @RequirePermissions("matching.read")
  getCandidateMatch(@Param("id") candidateMatchId: string) {
    return this.service.getCandidateMatch(candidateMatchId);
  }

  @Patch("candidate-matches/:id/status")
  @RequirePermissions("matching.run")
  updateCandidateMatchStatus(
    @Param("id") candidateMatchId: string,
    @Body() dto: UpdateCandidateMatchStatusDto
  ) {
    return this.service.updateCandidateMatchStatus(candidateMatchId, dto.status);
  }
}
