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
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { NotesService } from "./notes.service";

@Controller("notes")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Get()
  @RequirePermissions("candidates.read")
  findAll(
    @Query("entityType") entityType?: string,
    @Query("entityId") entityId?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    return this.service.findAll(
      entityType,
      entityId,
      Number(page ?? 1),
      Number(limit ?? 20)
    );
  }

  @Post()
  @RequirePermissions("candidates.update")
  create(@Body() dto: CreateNoteDto, @CurrentUser() user: AuthenticatedUser) {
    return this.service.create(dto, user.id);
  }

  @Patch(":id")
  @RequirePermissions("candidates.update")
  update(@Param("id") id: string, @Body() dto: UpdateNoteDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @RequirePermissions("candidates.update")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }

  @Post(":id/pin")
  @RequirePermissions("candidates.update")
  pin(@Param("id") id: string, @Body() body?: { pinned?: boolean }) {
    return this.service.pin(id, body?.pinned ?? true);
  }
}
