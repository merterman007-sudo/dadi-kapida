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
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import type { AuthenticatedUser } from "../../common/interfaces/authenticated-user.interface";
import { CreateMeetingDto } from "./dto/create-meeting.dto";
import { UpdateMeetingDto } from "./dto/update-meeting.dto";
import { MeetingsService } from "./meetings.service";

@Controller("meetings")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MeetingsController {
  constructor(private readonly service: MeetingsService) {}

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
  @RequirePermissions("families.update")
  create(@Body() dto: CreateMeetingDto, @CurrentUser() user: AuthenticatedUser) {
    return this.service.create(dto, user.id);
  }

  @Patch(":id")
  @RequirePermissions("families.update")
  update(@Param("id") id: string, @Body() dto: UpdateMeetingDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @RequirePermissions("families.update")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }

  @Post(":id/complete")
  @RequirePermissions("families.update")
  complete(@Param("id") id: string) {
    return this.service.complete(id);
  }

  @Post(":id/cancel")
  @RequirePermissions("families.update")
  cancel(@Param("id") id: string) {
    return this.service.cancel(id);
  }
}
