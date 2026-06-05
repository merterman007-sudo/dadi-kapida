import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  list(params: {
    page: number;
    limit: number;
    entityType?: string;
    entityId?: string;
    action?: string;
  }) {
    const { page, limit, entityType, entityId, action } = params;
    return this.prisma.auditLog.findMany({
      where: {
        ...(entityType ? { entity_type: entityType } : {}),
        ...(entityId ? { entity_id: entityId } : {}),
        ...(action ? { action: { contains: action, mode: "insensitive" } } : {})
      },
      skip: (Math.max(page, 1) - 1) * Math.max(limit, 1),
      take: Math.max(limit, 1),
      orderBy: { created_at: "desc" }
    });
  }
}
