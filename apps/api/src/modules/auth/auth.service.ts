import {
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { randomBytes, createHash } from "crypto";
import type { StringValue } from "ms";
import { PrismaService } from "../../prisma/prisma.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { LoginDto } from "./dto/login.dto";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto, ip?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || user.deleted_at || user.status !== "ACTIVE") {
      throw new UnauthorizedException("Invalid credentials");
    }

    const validPassword = await argon2.verify(user.password_hash, dto.password);
    if (!validPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const { roles, permissions } = await this.getAuthContext(user.id);
    const tokens = await this.issueTokenPair(user.id, user.email, roles, permissions);

    await this.prisma.userSession.create({
      data: {
        user_id: user.id,
        refresh_token_hash: this.hashToken(tokens.refreshToken),
        ip_address: ip,
        user_agent: userAgent,
        expires_at: this.computeRefreshExpiry()
      }
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        roles,
        permissions
      },
      ...tokens
    };
  }

  async refresh(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const session = await this.prisma.userSession.findFirst({
      where: {
        refresh_token_hash: tokenHash,
        revoked_at: null
      }
    });

    if (!session || session.expires_at < new Date()) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.prisma.user.findUnique({ where: { id: session.user_id } });
    if (!user || user.status !== "ACTIVE") {
      throw new UnauthorizedException("User unavailable");
    }

    const { roles, permissions } = await this.getAuthContext(user.id);
    const tokens = await this.issueTokenPair(user.id, user.email, roles, permissions);

    await this.prisma.userSession.update({
      where: { id: session.id },
      data: {
        refresh_token_hash: this.hashToken(tokens.refreshToken),
        expires_at: this.computeRefreshExpiry()
      }
    });

    return tokens;
  }

  async logout(refreshToken: string): Promise<{ success: boolean }> {
    const tokenHash = this.hashToken(refreshToken);
    await this.prisma.userSession.updateMany({
      where: {
        refresh_token_hash: tokenHash,
        revoked_at: null
      },
      data: {
        revoked_at: new Date()
      }
    });

    return { success: true };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const { roles, permissions } = await this.getAuthContext(user.id);

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      roles,
      permissions
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ success: boolean }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const validPassword = await argon2.verify(user.password_hash, dto.currentPassword);
    if (!validPassword) {
      throw new ForbiddenException("Current password is incorrect");
    }

    const newHash = await argon2.hash(dto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password_hash: newHash }
    });

    await this.prisma.userSession.updateMany({
      where: {
        user_id: userId,
        revoked_at: null
      },
      data: { revoked_at: new Date() }
    });

    return { success: true };
  }

  private async issueTokenPair(
    userId: string,
    email: string,
    roles: string[],
    permissions: string[]
  ): Promise<TokenPair> {
    const payload = {
      sub: userId,
      email,
      roles,
      permissions
    };

    const accessSecret =
      process.env.JWT_ACCESS_SECRET ?? "dev_access_secret_change_me";
    const accessTokenTtl = (process.env.ACCESS_TOKEN_TTL ?? "15m") as StringValue;

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessSecret,
      expiresIn: accessTokenTtl
    });

    const refreshToken = `${randomBytes(32).toString("hex")}.${userId}`;

    return {
      accessToken,
      refreshToken
    };
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private computeRefreshExpiry(): Date {
    const days = Number((process.env.REFRESH_TOKEN_TTL ?? "30d").replace("d", ""));
    const ttlDays = Number.isNaN(days) ? 30 : days;
    return new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  }

  private async getAuthContext(userId: string): Promise<{ roles: string[]; permissions: string[] }> {
    const userRoles = await this.prisma.userRole.findMany({ where: { user_id: userId } });
    const roleIds = userRoles.map((row) => row.role_id);

    if (roleIds.length === 0) {
      return { roles: [], permissions: [] };
    }

    const roles = await this.prisma.role.findMany({ where: { id: { in: roleIds } } });
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { role_id: { in: roleIds } }
    });
    const permissionIds = [...new Set(rolePermissions.map((row) => row.permission_id))];

    const permissions =
      permissionIds.length === 0
        ? []
        : await this.prisma.permission.findMany({ where: { id: { in: permissionIds } } });

    return {
      roles: roles.map((role) => role.name),
      permissions: permissions.map((permission) => permission.key)
    };
  }
}
