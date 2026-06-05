import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import type { AuthenticatedUser } from "../../common/interfaces/authenticated-user.interface";
import { CreatePlacementDto } from "./dto/create-placement.dto";
import { UpdatePlacementStatusDto } from "./dto/update-placement-status.dto";
import { UpdatePlacementDto } from "./dto/update-placement.dto";
import { PlacementsService } from "./placements.service";

@Controller("placements")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PlacementsController {
  constructor(private readonly service: PlacementsService) {}

  @Get()
  @RequirePermissions("families.read")
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("status") status?: string
  ) {
    return this.service.findAll(Number(page ?? 1), Number(limit ?? 20), status);
  }

  @Get(":id")
  @RequirePermissions("families.read")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @RequirePermissions("placements.create")
  create(@Body() dto: CreatePlacementDto, @CurrentUser() user: AuthenticatedUser) {
    return this.service.create(dto, user.id);
  }

  @Patch(":id")
  @RequirePermissions("placements.update")
  update(@Param("id") id: string, @Body() dto: UpdatePlacementDto) {
    return this.service.update(id, dto);
  }

  @Post(":id/status")
  @RequirePermissions("placements.update")
  updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdatePlacementStatusDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.updateStatus(id, dto, user.id);
  }

  @Get("_status")
  @RequirePermissions("families.read")
  getStatus() {
    return this.service.getStatus();
  }
}
