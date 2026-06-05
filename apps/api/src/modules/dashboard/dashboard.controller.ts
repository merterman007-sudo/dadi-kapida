import { Controller, Get, UseGuards } from "@nestjs/common";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get()
  @RequirePermissions("reports.read")
  metrics() {
    return this.service.metrics();
  }

  @Get("trend")
  @RequirePermissions("reports.read")
  trend() {
    return this.service.trend();
  }
}
