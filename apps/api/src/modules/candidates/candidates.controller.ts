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
import { CreateCandidateDto } from "./dto/create-candidate.dto";
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

  @Get(":id")
  @RequirePermissions("candidates.read")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
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
