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
import { AddShortlistItemDto } from "./dto/add-shortlist-item.dto";
import { CreateShortlistDto } from "./dto/create-shortlist.dto";
import { UpdateShortlistDto } from "./dto/update-shortlist.dto";
import { UpdateShortlistItemDto } from "./dto/update-shortlist-item.dto";
import { ShortlistsService } from "./shortlists.service";

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ShortlistsController {
  constructor(private readonly service: ShortlistsService) {}

  @Get("shortlists")
  @RequirePermissions("matching.read")
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("family_request_id") familyRequestId?: string
  ) {
    return this.service.findAll(Number(page ?? 1), Number(limit ?? 20), familyRequestId);
  }

  @Get("shortlists/:id")
  @RequirePermissions("matching.read")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post("shortlists")
  @RequirePermissions("matching.run")
  create(
    @Body() dto: CreateShortlistDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.create(dto, user.id);
  }

  @Patch("shortlists/:id")
  @RequirePermissions("matching.run")
  update(@Param("id") id: string, @Body() dto: UpdateShortlistDto) {
    return this.service.update(id, dto);
  }

  @Delete("shortlists/:id")
  @RequirePermissions("matching.run")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }

  @Post("shortlists/:id/items")
  @RequirePermissions("matching.run")
  addItem(@Param("id") shortlistId: string, @Body() dto: AddShortlistItemDto) {
    return this.service.addItem(shortlistId, dto);
  }

  @Patch("shortlist-items/:id")
  @RequirePermissions("matching.run")
  updateItem(@Param("id") itemId: string, @Body() dto: UpdateShortlistItemDto) {
    return this.service.updateItem(itemId, dto);
  }

  @Delete("shortlist-items/:id")
  @RequirePermissions("matching.run")
  removeItem(@Param("id") itemId: string) {
    return this.service.removeItem(itemId);
  }
}
