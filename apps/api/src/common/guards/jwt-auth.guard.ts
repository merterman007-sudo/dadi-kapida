import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization as string | undefined;

    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing bearer token");
    }

    const token = header.slice("Bearer ".length);
    const accessSecret = process.env.JWT_ACCESS_SECRET ?? "dev_access_secret_change_me";
    try {
      const payload = this.jwtService.verify(token, {
        secret: accessSecret
      }) as {
        sub: string;
        email: string;
        roles: string[];
        permissions: string[];
      };

      request.user = {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles,
        permissions: payload.permissions
      };
      return true;
    } catch {
      throw new UnauthorizedException("Invalid access token");
    }
  }
}
