import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { CreateFamilyDto } from "./dto/create-family.dto";
import { UpdateFamilyDto } from "./dto/update-family.dto";
import { FamiliesService } from "./families.service";

@Controller("families")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FamiliesController {
  constructor(private readonly service: FamiliesService) {}

  @Get()
  @RequirePermissions("families.read")
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("q") q?: string
  ) {
    return this.service.findAll(Number(page ?? 1), Number(limit ?? 20), q);
  }

  @Get(":id")
  @RequirePermissions("families.read")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @RequirePermissions("families.create")
  create(@Body() dto: CreateFamilyDto) {
    return this.service.create(dto);
  }

  @Patch(":id")
  @RequirePermissions("families.update")
  update(@Param("id") id: string, @Body() dto: UpdateFamilyDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @RequirePermissions("families.delete")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}
