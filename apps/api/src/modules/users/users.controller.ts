import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { RequirePermissions } from "../../common/decorators/require-permissions.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @RequirePermissions("users.manage")
  list() {
    return this.service.list();
  }

  @Post()
  @RequirePermissions("users.manage")
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }
}
