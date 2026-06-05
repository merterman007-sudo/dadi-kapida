import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { CreateFamilyRequestDto } from "./dto/create-family-request.dto";
import { UpdateFamilyRequestDto } from "./dto/update-family-request.dto";
import { FamilyRequestsService } from "./family-requests.service";

@Controller("family-requests")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FamilyRequestsController {
  constructor(private readonly service: FamilyRequestsService) {}

  @Get()
  @RequirePermissions("family_requests.read")
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("q") q?: string
  ) {
    return this.service.findAll(Number(page ?? 1), Number(limit ?? 20), q);
  }

  @Get(":id")
  @RequirePermissions("family_requests.read")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @RequirePermissions("family_requests.create")
  create(@Body() dto: CreateFamilyRequestDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  @RequirePermissions("family_requests.update")
  update(@Param("id") id: string, @Body() dto: UpdateFamilyRequestDto) {
    return this.service.update(id, dto);
  }
}
