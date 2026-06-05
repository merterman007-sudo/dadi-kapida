import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const API_URL = process.env.PLAYWRIGHT_API_URL ?? "http://localhost:3001";
const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL ?? "admin@dadikapida.local";
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? "admin123";

function stamp() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function login(request: APIRequestContext) {
  const response = await request.post(`${API_URL}/auth/login`, {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
  });
  expect(response.status()).toBe(201);
  const payload = await response.json();
  return payload.data.accessToken as string;
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  expect(overflow).toBe(false);
}

async function fillFamilyApplication(page: Page) {
  const id = stamp();
  await page.goto("/aile-basvurusu");
  await expect(page.locator("h1")).toContainText(/Aileniz/);

  await page.locator("main input").nth(0).fill(`Playwright Aile ${id}`);
  await page.locator('input[type="tel"]').fill(`0555${String(Date.now()).slice(-7)}`);
  await page.locator('input[type="email"]').fill(`family.${id}@example.com`);
  await page.locator("main input").nth(3).fill("Istanbul");
  await page.locator("main input").nth(4).fill("Kadikoy");
  await page.getByRole("button").filter({ hasText: /Devam/ }).click();

  await page.locator("select").first().selectOption("yatili-dadi");
  await page.locator("textarea").fill("Playwright aile basvuru testi.");
  await page.getByRole("button").filter({ hasText: /Devam/ }).click();

  await page.waitForTimeout(2600);
  await page.locator('input[type="checkbox"]').first().check();
  await page.getByRole("button").filter({ hasText: /vuruyu/ }).click();
  await expect(page).toHaveURL(/\/tesekkurler\/aile-basvurusu/);
}

async function fillNannyApplication(page: Page) {
  const id = stamp();
  await page.goto("/dadi-basvurusu");
  await expect(page.locator("h1")).toContainText(/Profesyonel/);

  await page.locator("main input").nth(0).fill(`Playwright Aday ${id}`);
  await page.locator('input[type="tel"]').fill(`0554${String(Date.now()).slice(-7)}`);
  await page.locator('input[type="email"]').fill(`nanny.${id}@example.com`);
  await page.getByRole("button").filter({ hasText: /Devam/ }).click();

  await page.locator('input[type="date"]').fill("1994-04-12");
  await page.locator("main input").nth(1).fill("Istanbul");
  await page.locator("main input").nth(2).fill("Besiktas");
  await page.locator("select").first().selectOption("3-5");
  await page.locator("select").nth(1).selectOption("gunduzlu");
  await page.locator("textarea").fill("Playwright aday basvuru testi.");
  await page.getByRole("button").filter({ hasText: /Devam/ }).click();

  await page.waitForTimeout(2600);
  await page.locator('input[type="checkbox"]').first().check();
  await page.getByRole("button").filter({ hasText: /vuruyu/ }).click();
  await expect(page).toHaveURL(/\/tesekkurler\/dadi-basvurusu/);
}

test.describe("public website browser smoke", () => {
  test("home header, footer and CTA links navigate", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expectNoHorizontalOverflow(page);

    if (testInfo.project.name.includes("mobile")) {
      await page.getByRole("button", { name: /men/i }).click();
      const mobileLink = page.locator(".fixed nav a[href]").first();
      await expect(mobileLink).toBeVisible();
      await mobileLink.click();
    } else {
      const firstHeaderLink = page.locator("header nav a[href]").first();
      await expect(firstHeaderLink).toBeVisible();
      await firstHeaderLink.click();
    }
    await expect(page).not.toHaveURL(/\/$/);
    await expect(page.locator("h1")).toBeVisible();

    await page.goto("/");
    await page.locator("footer a[href='/iletisim']").first().click();
    await expect(page).toHaveURL(/\/iletisim/);
    await expect(page.locator("h1")).toBeVisible();

    await page.goto("/");
    const cta = page.locator("a[href='/aile-basvurusu']:visible").filter({ hasText: /Aile/ }).first();
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/aile-basvurusu/);
    await expectNoHorizontalOverflow(page);

    expect(testInfo.project.name).toMatch(/chromium/);
  });

  test("mobile menu opens and mobile CTA links work", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes("mobile"), "mobile-only navigation check");

    await page.goto("/");
    await page.getByRole("button", { name: /men/i }).click();
    const servicesLink = page.locator(".fixed nav a[href='/hizmetlerimiz']").first();
    await expect(servicesLink).toBeVisible();
    await servicesLink.click();
    await expect(page).toHaveURL(/\/hizmetlerimiz/);

    await page.goto("/");
    await page.locator("a[href='/dadi-basvurusu']:visible").filter({ hasText: /D/ }).last().click();
    await expect(page).toHaveURL(/\/dadi-basvurusu/);
    await expectNoHorizontalOverflow(page);
  });

  test("family application submits end to end", async ({ page }) => {
    await fillFamilyApplication(page);
  });

  test("nanny application submits end to end", async ({ page }) => {
    await fillNannyApplication(page);
  });

  test("contact request form submits end to end", async ({ page }) => {
    const id = stamp();
    await page.goto("/iletisim");
    await page.waitForTimeout(2600);
    await page.locator("input").nth(0).fill(`Playwright Contact ${id}`);
    await page.locator("input").nth(1).fill(`0553${String(Date.now()).slice(-7)}`);
    await page.locator("input").nth(2).fill(`contact.${id}@example.com`);
    await page.locator("textarea").fill("Playwright iletisim form testi.");
    await page.locator('input[type="checkbox"]').first().check();
    await page.getByRole("button").filter({ hasText: /G/ }).click();
    await expect(page).toHaveURL(/\/tesekkurler\/iletisim/);
  });

  test("admin CMS page publish reflects on public website", async ({ page, request }) => {
    const token = await login(request);
    const id = stamp();
    const slug = `playwright-cms-${id}`;
    const title = `Playwright CMS ${id}`;

    const create = await request.post(`${API_URL}/api/v1/admin/website/pages`, {
      headers: { authorization: `Bearer ${token}` },
      data: {
        type: "PAGE",
        slug,
        title,
        status: "PUBLISHED",
        hero_title: title,
        hero_subtitle: "Browser E2E CMS reflection test",
        payload: { sections: [{ type: "body", body: "Created by Playwright and deleted after verification." }] },
        seo_title: title,
        meta_description: "Browser E2E CMS reflection test page."
      }
    });
    expect(create.status()).toBe(201);
    const created = await create.json();

    try {
      await page.goto(`/${slug}`);
      await expect(page.locator("h1")).toContainText(title);
      await expect(page).toHaveTitle(new RegExp(title));
      await expectNoHorizontalOverflow(page);
    } finally {
      await request.delete(`${API_URL}/api/v1/admin/website/pages/${created.data.id}`, {
        headers: { authorization: `Bearer ${token}` }
      });
    }
  });
});
