import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import type { AuthenticatedUser } from "../../common/interfaces/authenticated-user.interface";
import { ApplicationsService } from "./applications.service";
import { PublicApplicationCreateDto } from "./dto/public-application-create.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";

@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post("public/applications")
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  createPublicApplication(
    @Body() dto: PublicApplicationCreateDto,
    @Req() req: { body: unknown }
  ) {
    return this.applicationsService.createPublicApplication(dto, req.body);
  }

  @Get("applications")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("applications.read")
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    return this.applicationsService.findAll(Number(page ?? 1), Number(limit ?? 20));
  }

  @Get("applications/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("applications.read")
  findOne(@Param("id") id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch("applications/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("applications.read")
  update(@Param("id") id: string, @Body() dto: UpdateApplicationDto) {
    return this.applicationsService.update(id, dto);
  }

  @Delete("applications/:id")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("applications.convert")
  remove(@Param("id") id: string) {
    return this.applicationsService.remove(id);
  }

  @Post("applications/:id/convert-to-candidate")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("applications.convert")
  convertToCandidate(
    @Param("id") id: string,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.applicationsService.convertToCandidate(id, user.id);
  }

  @Post("applications/:id/reject")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("applications.convert")
  reject(@Param("id") id: string) {
    return this.applicationsService.reject(id);
  }

  @Post("applications/:id/mark-duplicate")
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions("applications.convert")
  markDuplicate(@Param("id") id: string) {
    return this.applicationsService.markDuplicate(id);
  }
}
