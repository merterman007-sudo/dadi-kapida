import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { ReportsService } from "./reports.service";

@Controller("reports")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get("_status")
  @RequirePermissions("families.read")
  getStatus() {
    return this.service.getStatus();
  }

  @Get("dashboard")
  @RequirePermissions("families.read")
  dashboard(@Query("from") from?: string, @Query("to") to?: string) {
    return this.service.dashboard({ from, to });
  }

  @Get("candidates")
  @RequirePermissions("families.read")
  candidates(@Query("from") from?: string, @Query("to") to?: string) {
    return this.service.candidates({ from, to });
  }

  @Get("applications")
  @RequirePermissions("families.read")
  applications(@Query("from") from?: string, @Query("to") to?: string) {
    return this.service.applications({ from, to });
  }

  @Get("family-requests")
  @RequirePermissions("families.read")
  familyRequests(@Query("from") from?: string, @Query("to") to?: string) {
    return this.service.familyRequests({ from, to });
  }

  @Get("placements")
  @RequirePermissions("families.read")
  placements(@Query("from") from?: string, @Query("to") to?: string) {
    return this.service.placements({ from, to });
  }

  @Get("finance")
  @RequirePermissions("families.read")
  finance(@Query("from") from?: string, @Query("to") to?: string) {
    return this.service.finance({ from, to });
  }

  @Get("staff-performance")
  @RequirePermissions("families.read")
  staffPerformance() {
    return this.service.staffPerformance();
  }
}
