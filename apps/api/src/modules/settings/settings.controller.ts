import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { SettingsService } from "./settings.service";

@Controller("settings")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get("_status")
  @RequirePermissions("settings.manage")
  getStatus() {
    return this.service.getStatus();
  }

  @Get("categories")
  @RequirePermissions("settings.manage")
  listCategories() {
    return this.service.listCategories();
  }

  @Get("status-guide")
  @RequirePermissions("settings.manage")
  getStatusGuide() {
    return this.service.getStatusGuide();
  }

  @Post("demo/reseed")
  @RequirePermissions("settings.manage")
  reseedDemoData() {
    return this.service.reseedDemoData();
  }
}
