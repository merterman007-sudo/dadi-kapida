import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { bearer, loginAndGetAccessToken } from "./utils/auth";
import { createTestApp } from "./utils/create-test-app";

describe("Deletion Flow (e2e)", () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    app = await createTestApp();
    const login = await loginAndGetAccessToken(
      app,
      "admin@dadikapida.local",
      "admin123"
    );
    expect(login.status).toBe(201);
    token = login.token as string;
  });

  afterAll(async () => {
    await app.close();
  });

  it("creates and safely deletes operational CRM records", async () => {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-10);
    const auth = bearer(token);

    const application = await request(app.getHttpServer())
      .post("/public/applications")
      .send({
        first_name: "Silme",
        last_name: `Testi${suffix}`,
        phone: `905${suffix}`,
        source: "E2E_DELETE"
      })
      .expect(201);
    const applicationId = application.body.data.id as string;
    await request(app.getHttpServer())
      .delete(`/applications/${applicationId}`)
      .set("Authorization", auth)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/applications/${applicationId}`)
      .set("Authorization", auth)
      .expect(404);

    const family = await request(app.getHttpServer())
      .post("/families")
      .set("Authorization", auth)
      .send({
        family_name: `Silme Ailesi ${suffix}`,
        primary_contact_name: "Test Kişisi",
        primary_contact_phone: `532${suffix}`
      })
      .expect(201);
    const familyId = family.body.data.id as string;

    const candidate = await request(app.getHttpServer())
      .post("/candidates")
      .set("Authorization", auth)
      .send({
        first_name: "Silme",
        last_name: `Personeli${suffix}`,
        phone: `533${suffix}`
      })
      .expect(201);
    const candidateId = candidate.body.data.id as string;

    const familyRequest = await request(app.getHttpServer())
      .post("/family-requests")
      .set("Authorization", auth)
      .send({
        family_id: familyId,
        title: `Silinebilir Talep ${suffix}`
      })
      .expect(201);
    const familyRequestId = familyRequest.body.data.id as string;

    const placement = await request(app.getHttpServer())
      .post("/placements")
      .set("Authorization", auth)
      .send({
        family_request_id: familyRequestId,
        family_id: familyId,
        candidate_id: candidateId,
        start_date: new Date().toISOString(),
        agreed_salary: 32000
      })
      .expect(201);
    const placementId = placement.body.data.id as string;

    const template = await request(app.getHttpServer())
      .post("/contract-templates")
      .set("Authorization", auth)
      .send({ name: `Silme Şablonu ${suffix}`, body: "Test sözleşmesi" })
      .expect(201);
    const templateId = template.body.data.id as string;

    const contract = await request(app.getHttpServer())
      .post("/contracts")
      .set("Authorization", auth)
      .send({
        contract_template_id: templateId,
        placement_id: placementId,
        family_id: familyId,
        candidate_id: candidateId
      })
      .expect(201);
    const contractId = contract.body.data.id as string;

    const invoice = await request(app.getHttpServer())
      .post("/finance/invoices")
      .set("Authorization", auth)
      .send({ family_id: familyId, placement_id: placementId, amount: 5000 })
      .expect(201);
    const invoiceId = invoice.body.data.id as string;

    const payment = await request(app.getHttpServer())
      .post("/finance/payments")
      .set("Authorization", auth)
      .send({ invoice_id: invoiceId, amount: 2500, status: "PAID" })
      .expect(201);
    const paymentId = payment.body.data.id as string;

    const expense = await request(app.getHttpServer())
      .post("/finance/expenses")
      .set("Authorization", auth)
      .send({
        placement_id: placementId,
        title: `Silme Gideri ${suffix}`,
        amount: 750
      })
      .expect(201);
    const expenseId = expense.body.data.id as string;

    const message = await request(app.getHttpServer())
      .post("/messages")
      .set("Authorization", auth)
      .send({
        channel: "SYSTEM",
        direction: "OUTBOUND",
        content: `Silme mesajı ${suffix}`
      })
      .expect(201);
    const messageId = message.body.data.id as string;

    const document = await request(app.getHttpServer())
      .post(`/candidates/${candidateId}/documents`)
      .set("Authorization", auth)
      .send({
        document_type: "test",
        file_path: `/tmp/${suffix}.pdf`,
        file_name: `${suffix}.pdf`
      })
      .expect(201);
    const documentId = document.body.data.id as string;

    const reference = await request(app.getHttpServer())
      .post(`/candidates/${candidateId}/references`)
      .set("Authorization", auth)
      .send({ full_name: `Referans ${suffix}` })
      .expect(201);
    const referenceId = reference.body.data.id as string;

    const check = await request(app.getHttpServer())
      .post(`/candidate-references/${referenceId}/checks`)
      .set("Authorization", auth)
      .send({ status: "VERIFIED", score: 90 })
      .expect(201);
    const checkId = check.body.data.id as string;

    await request(app.getHttpServer())
      .delete(`/reference-checks/${checkId}`)
      .set("Authorization", auth)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/candidate-references/${referenceId}`)
      .set("Authorization", auth)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/candidate-documents/${documentId}`)
      .set("Authorization", auth)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/messages/${messageId}`)
      .set("Authorization", auth)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/placements/${placementId}`)
      .set("Authorization", auth)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/placements/${placementId}`)
      .set("Authorization", auth)
      .expect(404);

    const [contracts, invoices, expenses] = await Promise.all([
      request(app.getHttpServer()).get("/contracts?page=1&limit=100").set("Authorization", auth),
      request(app.getHttpServer()).get("/finance/invoices?page=1&limit=100").set("Authorization", auth),
      request(app.getHttpServer()).get("/finance/expenses?page=1&limit=100").set("Authorization", auth)
    ]);
    expect(contracts.body.data.find((row: { id: string }) => row.id === contractId)?.placement_id).toBeNull();
    expect(invoices.body.data.find((row: { id: string }) => row.id === invoiceId)?.placement_id).toBeNull();
    expect(expenses.body.data.find((row: { id: string }) => row.id === expenseId)?.placement_id).toBeNull();

    await request(app.getHttpServer())
      .delete(`/contracts/${contractId}`)
      .set("Authorization", auth)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/contract-templates/${templateId}`)
      .set("Authorization", auth)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/finance/payments/${paymentId}`)
      .set("Authorization", auth)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/finance/invoices/${invoiceId}`)
      .set("Authorization", auth)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/finance/expenses/${expenseId}`)
      .set("Authorization", auth)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/family-requests/${familyRequestId}`)
      .set("Authorization", auth)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/candidates/${candidateId}`)
      .set("Authorization", auth)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/families/${familyId}`)
      .set("Authorization", auth)
      .expect(200);
  });
});
