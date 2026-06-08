import { Injectable, NotFoundException } from "@nestjs/common";
import { ContractStatus } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateContractDto } from "./dto/create-contract.dto";
import { CreateContractTemplateDto } from "./dto/create-contract-template.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { UpdateContractTemplateDto } from "./dto/update-contract-template.dto";

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  listTemplates() {
    return this.prisma.contractTemplate.findMany({
      orderBy: { updated_at: "desc" }
    });
  }

  createTemplate(dto: CreateContractTemplateDto, actorUserId?: string) {
    return this.prisma.contractTemplate.create({
      data: {
        ...dto,
        created_by_user_id: actorUserId
      }
    });
  }

  async updateTemplate(id: string, dto: UpdateContractTemplateDto) {
    await this.ensureTemplate(id);
    return this.prisma.contractTemplate.update({
      where: { id },
      data: dto
    });
  }

  async removeTemplate(id: string) {
    await this.ensureTemplate(id);
    await this.prisma.contractTemplate.delete({ where: { id } });
    return { success: true };
  }

  listContracts(page = 1, limit = 20) {
    return this.prisma.contract.findMany({
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });
  }

  async findContract(id: string) {
    const contract = await this.prisma.contract.findUnique({ where: { id } });
    if (!contract) {
      throw new NotFoundException("Contract not found");
    }
    return contract;
  }

  createContract(dto: CreateContractDto, actorUserId?: string) {
    return this.prisma.contract.create({
      data: {
        ...dto,
        sent_at: dto.sent_at ? new Date(dto.sent_at) : undefined,
        signed_at: dto.signed_at ? new Date(dto.signed_at) : undefined,
        expires_at: dto.expires_at ? new Date(dto.expires_at) : undefined,
        created_by_user_id: actorUserId
      }
    });
  }

  async updateContract(id: string, dto: UpdateContractDto) {
    await this.findContract(id);
    return this.prisma.contract.update({
      where: { id },
      data: {
        ...dto,
        sent_at: dto.sent_at ? new Date(dto.sent_at) : undefined,
        signed_at: dto.signed_at ? new Date(dto.signed_at) : undefined,
        expires_at: dto.expires_at ? new Date(dto.expires_at) : undefined
      }
    });
  }

  async removeContract(id: string) {
    await this.findContract(id);
    await this.prisma.contract.delete({ where: { id } });
    return { success: true };
  }

  async markSigned(id: string) {
    await this.findContract(id);
    return this.prisma.contract.update({
      where: { id },
      data: {
        status: ContractStatus.SIGNED,
        signed_at: new Date()
      }
    });
  }

  async cancel(id: string) {
    await this.findContract(id);
    return this.prisma.contract.update({
      where: { id },
      data: {
        status: ContractStatus.CANCELLED
      }
    });
  }

  private async ensureTemplate(id: string) {
    const template = await this.prisma.contractTemplate.findUnique({
      where: { id },
      select: { id: true }
    });
    if (!template) {
      throw new NotFoundException("Contract template not found");
    }
  }
}
