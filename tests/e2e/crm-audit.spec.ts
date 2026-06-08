import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const CRM_URL = (process.env.PLAYWRIGHT_CRM_URL ?? "http://localhost:3000").replace(/\/$/, "");
const API_URL = (process.env.PLAYWRIGHT_API_URL ?? "http://localhost:3001").replace(/\/$/, "");
const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL ?? "admin@dadikapida.local";
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? "admin123";

const staticRoutes = [
  "/dashboard",
  "/applications",
  "/candidates",
  "/candidates/new",
  "/families",
  "/families/new",
  "/family-requests",
  "/family-requests/new",
  "/shortlists",
  "/notes",
  "/documents",
  "/references",
  "/meetings",
  "/tasks",
  "/placements",
  "/contracts",
  "/messages",
  "/finance",
  "/reports",
  "/audit-logs",
  "/settings/users",
  "/settings/categories",
  "/settings/roles",
  "/settings/website"
] as const;

type ApiEnvelope<T> = {
  data: T;
};

async function login(request: APIRequestContext) {
  const response = await request.post(`${API_URL}/auth/login`, {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
  });
  expect(response.status()).toBe(201);
  const payload = (await response.json()) as ApiEnvelope<{ accessToken: string }>;
  return payload.data.accessToken;
}

async function firstId(request: APIRequestContext, token: string, path: string) {
  const response = await request.get(`${API_URL}${path}`, {
    headers: { authorization: `Bearer ${token}` }
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as ApiEnvelope<Array<{ id: string }>>;
  return payload.data[0]?.id;
}

async function expectControlsAreNamed(page: Page, route: string) {
  const unnamedButtons = await page.locator("button:visible").evaluateAll((buttons) =>
    buttons
      .map((button, index) => ({
        index,
        name:
          button.getAttribute("aria-label")?.trim() ||
          button.getAttribute("title")?.trim() ||
          button.textContent?.trim() ||
          ""
      }))
      .filter((button) => !button.name)
  );
  expect(unnamedButtons, `${route} sayfasında adsız buton var`).toEqual([]);

  const invalidLinks = await page.locator("a:visible").evaluateAll((links) =>
    links
      .map((link, index) => ({
        index,
        href: link.getAttribute("href") ?? "",
        name:
          link.getAttribute("aria-label")?.trim() ||
          link.getAttribute("title")?.trim() ||
          link.textContent?.trim() ||
          ""
      }))
      .filter((link) => !link.name || !link.href || link.href === "#" || link.href.startsWith("javascript:"))
  );
  expect(invalidLinks, `${route} sayfasında geçersiz bağlantı var`).toEqual([]);
}

test.describe("CRM tam sayfa ve kontrol denetimi", () => {
  test("tüm CRM sayfaları 500, konsol hatası, bozuk metin ve adsız kontrol olmadan açılır", async ({
    page,
    request
  }) => {
    test.setTimeout(300_000);
    const token = await login(request);
    await page.addInitScript((accessToken) => {
      window.localStorage.setItem("crm_access_token", accessToken);
    }, token);

    const dynamicRoutes: string[] = [];
    const applicationId = await firstId(request, token, "/applications?page=1&limit=1");
    const candidateId = await firstId(request, token, "/candidates?page=1&limit=1");
    const familyId = await firstId(request, token, "/families?page=1&limit=1");
    const familyRequestId = await firstId(request, token, "/family-requests?page=1&limit=1");
    const placementId = await firstId(request, token, "/placements?page=1&limit=1");

    if (applicationId) dynamicRoutes.push(`/applications/${applicationId}`);
    if (candidateId) dynamicRoutes.push(`/candidates/${candidateId}`);
    if (familyId) dynamicRoutes.push(`/families/${familyId}`);
    if (familyRequestId) {
      dynamicRoutes.push(`/family-requests/${familyRequestId}`);
      dynamicRoutes.push(`/family-requests/${familyRequestId}/matches`);
    }
    if (placementId) dynamicRoutes.push(`/placements/${placementId}`);

    const routes = [...staticRoutes, ...dynamicRoutes];
    for (const route of routes) {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      const serverErrors: string[] = [];
      const onConsole = (message: { type(): string; text(): string }) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      };
      const onPageError = (error: Error) => pageErrors.push(error.message);
      const onResponse = (response: { status(): number; url(): string }) => {
        if (response.status() >= 500) serverErrors.push(`${response.status()} ${response.url()}`);
      };

      page.on("console", onConsole);
      page.on("pageerror", onPageError);
      page.on("response", onResponse);

      const response = await page.goto(`${CRM_URL}${route}`, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${route} sayfası açılamadı`).toBe(200);
      await page.waitForTimeout(500);
      await expect(page.locator("body")).not.toContainText(/Internal server error/i);
      await expect(page.locator("body")).not.toContainText(/Candidate ID|Family Request|Family:|Candidate:/);

      const bodyText = (await page.locator("body").innerText()).replace(/\s+/g, " ");
      expect(bodyText, `${route} sayfasında bozuk Türkçe karakter var`).not.toMatch(/Ã|Ä|Å|Â/);
      expect(consoleErrors, `${route} konsol hataları`).toEqual([]);
      expect(pageErrors, `${route} sayfa hataları`).toEqual([]);
      expect(serverErrors, `${route} sunucu hataları`).toEqual([]);
      await expectControlsAreNamed(page, route);

      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      page.off("response", onResponse);
    }
  });
});
