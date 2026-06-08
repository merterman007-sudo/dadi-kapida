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
import { CreateContractDto } from "./dto/create-contract.dto";
import { CreateContractTemplateDto } from "./dto/create-contract-template.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { UpdateContractTemplateDto } from "./dto/update-contract-template.dto";
import { ContractsService } from "./contracts.service";

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ContractsController {
  constructor(private readonly service: ContractsService) {}

  @Get("contract-templates")
  @RequirePermissions("finance.read")
  listTemplates() {
    return this.service.listTemplates();
  }

  @Post("contract-templates")
  @RequirePermissions("finance.update")
  createTemplate(
    @Body() dto: CreateContractTemplateDto,
    @CurrentUser() user: AuthenticatedUser
  ) {
    return this.service.createTemplate(dto, user.id);
  }

  @Patch("contract-templates/:id")
  @RequirePermissions("finance.update")
  updateTemplate(@Param("id") id: string, @Body() dto: UpdateContractTemplateDto) {
    return this.service.updateTemplate(id, dto);
  }

  @Delete("contract-templates/:id")
  @RequirePermissions("finance.update")
  removeTemplate(@Param("id") id: string) {
    return this.service.removeTemplate(id);
  }

  @Get("contracts")
  @RequirePermissions("finance.read")
  listContracts(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.service.listContracts(Number(page ?? 1), Number(limit ?? 20));
  }

  @Get("contracts/:id")
  @RequirePermissions("finance.read")
  findContract(@Param("id") id: string) {
    return this.service.findContract(id);
  }

  @Post("contracts")
  @RequirePermissions("finance.update")
  createContract(@Body() dto: CreateContractDto, @CurrentUser() user: AuthenticatedUser) {
    return this.service.createContract(dto, user.id);
  }

  @Patch("contracts/:id")
  @RequirePermissions("finance.update")
  updateContract(@Param("id") id: string, @Body() dto: UpdateContractDto) {
    return this.service.updateContract(id, dto);
  }

  @Delete("contracts/:id")
  @RequirePermissions("finance.update")
  removeContract(@Param("id") id: string) {
    return this.service.removeContract(id);
  }

  @Post("contracts/:id/mark-signed")
  @RequirePermissions("finance.update")
  markSigned(@Param("id") id: string) {
    return this.service.markSigned(id);
  }

  @Post("contracts/:id/cancel")
  @RequirePermissions("finance.update")
  cancel(@Param("id") id: string) {
    return this.service.cancel(id);
  }
}
