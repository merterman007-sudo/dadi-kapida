import { ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { ExecutionContext } from "@nestjs/common";
import { PermissionsGuard } from "./permissions.guard";

function createExecutionContext(user?: { permissions?: string[] }): ExecutionContext {
  return {
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({ user })
    })
  } as unknown as ExecutionContext;
}

describe("PermissionsGuard", () => {
  const reflector = {
    getAllAndOverride: jest.fn()
  } as unknown as Reflector;

  let guard: PermissionsGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new PermissionsGuard(reflector);
  });

  it("allows request when no required permission is declared", () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(undefined);
    const context = createExecutionContext();

    expect(guard.canActivate(context)).toBe(true);
  });

  it("throws when user context is missing while permissions are required", () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue(["users.manage"]);
    const context = createExecutionContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException("Permission context missing")
    );
  });

  it("throws when user does not have all required permissions", () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([
      "users.manage",
      "candidates.read"
    ]);
    const context = createExecutionContext({ permissions: ["candidates.read"] });

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException("Insufficient permissions")
    );
  });

  it("allows request when user has all required permissions", () => {
    (reflector.getAllAndOverride as jest.Mock).mockReturnValue([
      "users.manage",
      "candidates.read"
    ]);
    const context = createExecutionContext({
      permissions: ["users.manage", "candidates.read"]
    });

    expect(guard.canActivate(context)).toBe(true);
  });
});

