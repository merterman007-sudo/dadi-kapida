import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { bearer, loginAndGetAccessToken } from "./utils/auth";
import { createTestApp } from "./utils/create-test-app";

describe("Critical Flow (e2e)", () => {
  let app: INestApplication;
  let ownerToken: string;

  beforeAll(async () => {
    app = await createTestApp();

    const login = await loginAndGetAccessToken(
      app,
      "admin@dadikapida.local",
      "admin123"
    );

    expect(login.status).toBe(201);
    expect(login.token).toBeDefined();
    ownerToken = login.token as string;
  });

  afterAll(async () => {
    await app.close();
  });

  it("creates public application and converts it to candidate", async () => {
    const uniq = Date.now().toString().slice(-8);

    const createApplication = await request(app.getHttpServer())
      .post("/public/applications")
      .send({
        first_name: "E2E",
        last_name: `Aday${uniq}`,
        phone: `90555${uniq}`,
        email: `e2e.candidate.${uniq}@example.com`,
        city: "Istanbul",
        district: "Kadikoy",
        experience_years: 4,
        expected_salary_min: 20000,
        expected_salary_max: 26000,
        has_first_aid_certificate: true,
        source: "E2E_TEST"
      });

    expect(createApplication.status).toBe(201);
    const applicationId = createApplication.body?.data?.id as string;
    expect(applicationId).toBeDefined();

    const convert = await request(app.getHttpServer())
      .post(`/applications/${applicationId}/convert-to-candidate`)
      .set("Authorization", bearer(ownerToken))
      .send();

    expect(convert.status).toBe(201);
    const candidateId = convert.body?.data?.candidate?.id as string;
    expect(candidateId).toBeDefined();

    const candidateDetail = await request(app.getHttpServer())
      .get(`/candidates/${candidateId}`)
      .set("Authorization", bearer(ownerToken));

    expect(candidateDetail.status).toBe(200);
    expect(candidateDetail.body?.data?.id).toBe(candidateId);
  });

  it("creates family request and runs matching", async () => {
    const uniq = Date.now().toString().slice(-8);

    const family = await request(app.getHttpServer())
      .post("/families")
      .set("Authorization", bearer(ownerToken))
      .send({
        family_name: `E2E Ailesi ${uniq}`,
        primary_contact_name: "Test Kisi",
        primary_contact_phone: `90532${uniq}`,
        city: "Istanbul",
        district: "Besiktas"
      });

    expect(family.status).toBe(201);
    const familyId = family.body?.data?.id as string;
    expect(familyId).toBeDefined();

    const requestCreate = await request(app.getHttpServer())
      .post("/family-requests")
      .set("Authorization", bearer(ownerToken))
      .send({
        family_id: familyId,
        title: `E2E Talep ${uniq}`,
        city: "Istanbul",
        district: "Besiktas",
        min_experience_years: 2,
        salary_min: 18000,
        salary_max: 26000
      });

    expect(requestCreate.status).toBe(201);
    const familyRequestId = requestCreate.body?.data?.id as string;
    expect(familyRequestId).toBeDefined();

    const runMatching = await request(app.getHttpServer())
      .post(`/family-requests/${familyRequestId}/run-matching`)
      .set("Authorization", bearer(ownerToken))
      .send();

    expect(runMatching.status).toBe(201);
    expect(runMatching.body?.data?.run?.id).toBeDefined();
    expect(Array.isArray(runMatching.body?.data?.results)).toBe(true);
  });
});
