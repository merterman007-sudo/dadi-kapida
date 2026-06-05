import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { AuditLogsService } from "./audit-logs.service";

@Controller("audit-logs")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditLogsController {
  constructor(private readonly service: AuditLogsService) {}

  @Get()
  @RequirePermissions("users.manage")
  list(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("entityType") entityType?: string,
    @Query("entityId") entityId?: string,
    @Query("action") action?: string
  ) {
    return this.service.list({
      page: Number(page ?? 1),
      limit: Number(limit ?? 20),
      entityType,
      entityId,
      action
    });
  }
}
