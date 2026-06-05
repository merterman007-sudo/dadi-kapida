import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import type { AuthenticatedUser } from "../../common/interfaces/authenticated-user.interface";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { MessagesService } from "./messages.service";

@Controller("messages")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  @Get()
  @RequirePermissions("families.read")
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("channel") channel?: string
  ) {
    return this.service.findAll(Number(page ?? 1), Number(limit ?? 20), channel);
  }

  @Get(":id")
  @RequirePermissions("families.read")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @RequirePermissions("families.update")
  create(@Body() dto: CreateMessageDto, @CurrentUser() user: AuthenticatedUser) {
    return this.service.create(dto, user.id);
  }

  @Patch(":id")
  @RequirePermissions("families.update")
  update(@Param("id") id: string, @Body() dto: UpdateMessageDto) {
    return this.service.update(id, dto);
  }
}
