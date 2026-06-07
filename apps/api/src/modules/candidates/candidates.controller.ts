import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { CreateCandidateExperienceDto } from "./dto/create-candidate-experience.dto";
import { CreateCandidateLanguageDto } from "./dto/create-candidate-language.dto";
import { CreateCandidateWorkPreferenceDto } from "./dto/create-candidate-work-preference.dto";
import { CreateCandidateDto } from "./dto/create-candidate.dto";
import { UpdateCandidateExperienceDto } from "./dto/update-candidate-experience.dto";
import { UpdateCandidateLanguageDto } from "./dto/update-candidate-language.dto";
import { UpdateCandidateWorkPreferenceDto } from "./dto/update-candidate-work-preference.dto";
import { UpdateCandidateDto } from "./dto/update-candidate.dto";
import { CandidatesService } from "./candidates.service";

@Controller("candidates")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CandidatesController {
  constructor(private readonly service: CandidatesService) {}

  @Get()
  @RequirePermissions("candidates.read")
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("q") q?: string
  ) {
    return this.service.findAll(Number(page ?? 1), Number(limit ?? 20), q);
  }

  @Get("language-options")
  @RequirePermissions("candidates.read")
  listLanguageOptions() {
    return this.service.listAvailableLanguages();
  }

  @Get(":id")
  @RequirePermissions("candidates.read")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Get(":id/work-preferences")
  @RequirePermissions("candidates.read")
  listWorkPreferences(@Param("id") candidateId: string) {
    return this.service.listWorkPreferences(candidateId);
  }

  @Get(":id/experiences")
  @RequirePermissions("candidates.read")
  listExperiences(@Param("id") candidateId: string) {
    return this.service.listExperiences(candidateId);
  }

  @Post(":id/work-preferences")
  @RequirePermissions("candidates.update")
  createWorkPreference(
    @Param("id") candidateId: string,
    @Body() dto: CreateCandidateWorkPreferenceDto
  ) {
    return this.service.createWorkPreference(candidateId, dto);
  }

  @Patch("candidate-work-preferences/:id")
  @RequirePermissions("candidates.update")
  updateWorkPreference(
    @Param("id") workPreferenceId: string,
    @Body() dto: UpdateCandidateWorkPreferenceDto
  ) {
    return this.service.updateWorkPreference(workPreferenceId, dto);
  }

  @Delete("candidate-work-preferences/:id")
  @RequirePermissions("candidates.update")
  removeWorkPreference(@Param("id") workPreferenceId: string) {
    return this.service.removeWorkPreference(workPreferenceId);
  }

  @Post(":id/experiences")
  @RequirePermissions("candidates.update")
  createExperience(@Param("id") candidateId: string, @Body() dto: CreateCandidateExperienceDto) {
    return this.service.createExperience(candidateId, dto);
  }

  @Patch("candidate-experiences/:id")
  @RequirePermissions("candidates.update")
  updateExperience(@Param("id") experienceId: string, @Body() dto: UpdateCandidateExperienceDto) {
    return this.service.updateExperience(experienceId, dto);
  }

  @Delete("candidate-experiences/:id")
  @RequirePermissions("candidates.update")
  removeExperience(@Param("id") experienceId: string) {
    return this.service.removeExperience(experienceId);
  }

  @Get(":id/languages")
  @RequirePermissions("candidates.read")
  listLanguages(@Param("id") candidateId: string) {
    return this.service.listLanguages(candidateId);
  }

  @Post(":id/languages")
  @RequirePermissions("candidates.update")
  createLanguage(
    @Param("id") candidateId: string,
    @Body() dto: CreateCandidateLanguageDto
  ) {
    return this.service.createLanguage(candidateId, dto);
  }

  @Patch("candidate-languages/:id")
  @RequirePermissions("candidates.update")
  updateLanguage(@Param("id") languageId: string, @Body() dto: UpdateCandidateLanguageDto) {
    return this.service.updateLanguage(languageId, dto);
  }

  @Delete("candidate-languages/:id")
  @RequirePermissions("candidates.update")
  removeLanguage(@Param("id") languageId: string) {
    return this.service.removeLanguage(languageId);
  }

  @Post()
  @RequirePermissions("candidates.create")
  create(@Body() dto: CreateCandidateDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  @RequirePermissions("candidates.update")
  update(@Param("id") id: string, @Body() dto: UpdateCandidateDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @RequirePermissions("candidates.delete")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
