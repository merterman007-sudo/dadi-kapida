import type { INestApplication } from "@nestjs/common";
import { PrismaClient, UserStatus } from "@prisma/client";
import * as argon2 from "argon2";
import request from "supertest";
import { bearer, loginAndGetAccessToken } from "./utils/auth";
import { createTestApp } from "./utils/create-test-app";

describe("RBAC Matrix (e2e)", () => {
  const prisma = new PrismaClient();
  const readonlyEmail = "e2e.readonly@dadikapida.local";
  const readonlyPassword = process.env.DADI_KAPIDA_RBAC_READONLY_PASSWORD ?? process.env.PLAYWRIGHT_READONLY_PASSWORD;
  const ownerEmail = process.env.DADI_KAPIDA_BOOTSTRAP_ADMIN_EMAIL;
  const ownerPassword = process.env.DADI_KAPIDA_BOOTSTRAP_ADMIN_PASSWORD;

  if (!readonlyPassword) {
    throw new Error("Missing readonly test password. Set DADI_KAPIDA_RBAC_READONLY_PASSWORD or PLAYWRIGHT_READONLY_PASSWORD.");
  }

  if (!ownerEmail || !ownerPassword) {
    throw new Error(
      "Missing bootstrap admin credentials. Set DADI_KAPIDA_BOOTSTRAP_ADMIN_EMAIL and DADI_KAPIDA_BOOTSTRAP_ADMIN_PASSWORD."
    );
  }

  let app: INestApplication;
  let ownerToken: string;
  let readonlyToken: string;
  let readonlyUserId: string;

  beforeAll(async () => {
    app = await createTestApp();

    const role = await prisma.role.findUnique({
      where: { name: "ReadOnly" }
    });

    if (!role) {
      throw new Error("ReadOnly rolü bulunamadı. Önce `pnpm db:seed` çalıştırın.");
    }

    const passwordHash = await argon2.hash(readonlyPassword);
    const readonlyUser = await prisma.user.upsert({
      where: { email: readonlyEmail },
      update: {
        password_hash: passwordHash,
        status: UserStatus.ACTIVE
      },
      create: {
        first_name: "E2E",
        last_name: "ReadOnly",
        email: readonlyEmail,
        password_hash: passwordHash,
        status: UserStatus.ACTIVE
      }
    });

    readonlyUserId = readonlyUser.id;

    await prisma.userRole.upsert({
      where: {
        user_id_role_id: {
          user_id: readonlyUser.id,
          role_id: role.id
        }
      },
      update: {},
      create: {
        user_id: readonlyUser.id,
        role_id: role.id
      }
    });

    const ownerLogin = await loginAndGetAccessToken(
      app,
      ownerEmail,
      ownerPassword
    );
    const readonlyLogin = await loginAndGetAccessToken(
      app,
      readonlyEmail,
      readonlyPassword
    );

    expect(ownerLogin.status).toBe(201);
    expect(readonlyLogin.status).toBe(201);
    expect(ownerLogin.token).toBeDefined();
    expect(readonlyLogin.token).toBeDefined();

    ownerToken = ownerLogin.token as string;
    readonlyToken = readonlyLogin.token as string;
  });

  afterAll(async () => {
    await prisma.userSession.deleteMany({ where: { user_id: readonlyUserId } });
    await prisma.userRole.deleteMany({ where: { user_id: readonlyUserId } });
    await prisma.user.deleteMany({ where: { id: readonlyUserId } });
    await prisma.$disconnect();
    await app.close();
  });

  it("enforces endpoint permissions according to role matrix", async () => {
    const matrix: Array<{
      label: string;
      token?: string;
      method: "get" | "post";
      path: string;
      body?: Record<string, unknown>;
      expectedStatus: number;
    }> = [
      {
        label: "anonymous cannot access candidates list",
        method: "get",
        path: "/candidates",
        expectedStatus: 401
      },
      {
        label: "readonly can read candidates",
        token: readonlyToken,
        method: "get",
        path: "/candidates",
        expectedStatus: 200
      },
      {
        label: "readonly cannot access users management list",
        token: readonlyToken,
        method: "get",
        path: "/users",
        expectedStatus: 403
      },
      {
        label: "readonly cannot create candidate",
        token: readonlyToken,
        method: "post",
        path: "/candidates",
        body: {
          first_name: "RBAC",
          last_name: "Denied",
          phone: "905550001122"
        },
        expectedStatus: 403
      },
      {
        label: "owner can access users management list",
        token: ownerToken,
        method: "get",
        path: "/users",
        expectedStatus: 200
      }
    ];

    for (const item of matrix) {
      const req = request(app.getHttpServer())[item.method](item.path);
      if (item.token) {
        req.set("Authorization", bearer(item.token));
      }
      if (item.body) {
        req.send(item.body);
      }

      const response = await req;
      expect(response.status).toBe(item.expectedStatus);
    }
  });
});
