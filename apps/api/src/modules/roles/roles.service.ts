import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const roles = await this.prisma.role.findMany({ orderBy: { name: "asc" } });
    const rolePermissions = await this.prisma.rolePermission.findMany();
    const permissions = await this.prisma.permission.findMany();

    return roles.map((role) => {
      const permissionIds = rolePermissions
        .filter((row) => row.role_id === role.id)
        .map((row) => row.permission_id);

      return {
        ...role,
        permissions: permissions.filter((permission) => permissionIds.includes(permission.id))
      };
    });
  }
}
