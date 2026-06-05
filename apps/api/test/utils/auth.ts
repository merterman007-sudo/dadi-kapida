import type { INestApplication } from "@nestjs/common";
import request from "supertest";

export async function loginAndGetAccessToken(
  app: INestApplication,
  email: string,
  password: string
) {
  const response = await request(app.getHttpServer())
    .post("/auth/login")
    .send({ email, password });

  return {
    status: response.status,
    token: response.body?.data?.accessToken as string | undefined,
    body: response.body as {
      data?: { accessToken?: string };
    }
  };
}

export function bearer(token: string) {
  return `Bearer ${token}`;
}

