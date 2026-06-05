import { BadRequestException, Injectable } from "@nestjs/common";
import * as argon2 from "argon2";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const users = await this.prisma.user.findMany({
      where: { deleted_at: null },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        status: true,
        created_at: true
      },
      orderBy: { created_at: "desc" }
    });

    const userIds = users.map((user) => user.id);
    if (userIds.length === 0) {
      return [];
    }

    const [userRoles, roles] = await Promise.all([
      this.prisma.userRole.findMany({
        where: { user_id: { in: userIds } },
        select: { user_id: true, role_id: true }
      }),
      this.prisma.role.findMany({
        select: { id: true, name: true }
      })
    ]);

    return users.map((user) => {
      const roleNames = userRoles
        .filter((userRole) => userRole.user_id === user.id)
        .map((userRole) => roles.find((role) => role.id === userRole.role_id)?.name)
        .filter((roleName): roleName is string => Boolean(roleName));

      return {
        ...user,
        roles: roleNames
      };
    });
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await argon2.hash(dto.password);

    const roleIds = await this.resolveRoleIds(dto.role_ids);
    if (roleIds.length === 0) {
      throw new BadRequestException("At least one role is required");
    }

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          email: dto.email,
          phone: dto.phone,
          password_hash: passwordHash,
          status: dto.status ?? "ACTIVE"
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          status: true,
          created_at: true
        }
      });

      await tx.userRole.createMany({
        data: roleIds.map((roleId) => ({
          user_id: user.id,
          role_id: roleId
        }))
      });

      const roles = await tx.role.findMany({
        where: { id: { in: roleIds } },
        select: { name: true }
      });

      return {
        ...user,
        roles: roles.map((role) => role.name)
      };
    });
  }

  private async resolveRoleIds(inputRoleIds?: string[]) {
    if (inputRoleIds && inputRoleIds.length > 0) {
      const uniqueRoleIds = [...new Set(inputRoleIds)];
      const foundRoles = await this.prisma.role.findMany({
        where: { id: { in: uniqueRoleIds } },
        select: { id: true }
      });

      if (foundRoles.length !== uniqueRoleIds.length) {
        throw new BadRequestException("One or more role IDs are invalid");
      }

      return foundRoles.map((role) => role.id);
    }

    const staffRole = await this.prisma.role.findUnique({
      where: { name: "Staff" },
      select: { id: true }
    });

    return staffRole ? [staffRole.id] : [];
  }
}
