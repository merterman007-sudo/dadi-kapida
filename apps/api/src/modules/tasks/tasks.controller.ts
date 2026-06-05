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
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TasksService } from "./tasks.service";

@Controller("tasks")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get()
  @RequirePermissions("candidates.read")
  findAll(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("status") status?: string
  ) {
    return this.service.findAll(Number(page ?? 1), Number(limit ?? 20), status);
  }

  @Get("my")
  @RequirePermissions("candidates.read")
  findMy(
    @CurrentUser() user: AuthenticatedUser,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    return this.service.findMy(user.id, Number(page ?? 1), Number(limit ?? 20));
  }

  @Get(":id")
  @RequirePermissions("candidates.read")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @RequirePermissions("candidates.update")
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: AuthenticatedUser) {
    return this.service.create(dto, user.id);
  }

  @Patch(":id")
  @RequirePermissions("candidates.update")
  update(@Param("id") id: string, @Body() dto: UpdateTaskDto) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  @RequirePermissions("candidates.update")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }

  @Post(":id/complete")
  @RequirePermissions("candidates.update")
  complete(@Param("id") id: string) {
    return this.service.complete(id);
  }

  @Post(":id/reopen")
  @RequirePermissions("candidates.update")
  reopen(@Param("id") id: string) {
    return this.service.reopen(id);
  }
}
