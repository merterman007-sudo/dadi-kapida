const DEFAULT_WEBSITE_URL = process.env.AUDIT_WEBSITE_URL ?? "http://localhost:3002";
const DEFAULT_CRM_URL = process.env.AUDIT_CRM_URL ?? "http://localhost:3000";
const DEFAULT_API_URL = process.env.AUDIT_API_URL ?? "http://localhost:3001";
const DEFAULT_EMAIL = process.env.AUDIT_ADMIN_EMAIL ?? process.env.DADI_KAPIDA_BOOTSTRAP_ADMIN_EMAIL;
const DEFAULT_PASSWORD = process.env.AUDIT_ADMIN_PASSWORD ?? process.env.DADI_KAPIDA_BOOTSTRAP_ADMIN_PASSWORD;
const TIMEOUT_MS = Number.parseInt(process.env.AUDIT_TIMEOUT_MS ?? "15000", 10);

const websiteUrl = trimTrailingSlash(DEFAULT_WEBSITE_URL);
const crmUrl = trimTrailingSlash(DEFAULT_CRM_URL);
const apiUrl = trimTrailingSlash(DEFAULT_API_URL);

if (!DEFAULT_EMAIL || !DEFAULT_PASSWORD) {
  throw new Error(
    "Missing audit admin credentials. Set AUDIT_ADMIN_EMAIL/AUDIT_ADMIN_PASSWORD or DADI_KAPIDA_BOOTSTRAP_ADMIN_EMAIL/DADI_KAPIDA_BOOTSTRAP_ADMIN_PASSWORD."
  );
}

const results = [];

function trimTrailingSlash(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function nowId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function addResult(area, name, status, details = "") {
  results.push({ area, name, status, details });
  const tag = status === "pass" ? "PASS" : status === "warn" ? "WARN" : "FAIL";
  console.log(`[${tag}] ${area} | ${name}${details ? ` -> ${details}` : ""}`);
}

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function readJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function apiRequest(path, { method = "GET", token, body } = {}) {
  const response = await fetchWithTimeout(`${apiUrl}${path}`, {
    method,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return { response, payload: await readJson(response) };
}

function extractAttr(html, tag, attr) {
  const values = [];
  const pattern = new RegExp(`<${tag}\\b[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "gi");
  let match;
  while ((match = pattern.exec(html))) values.push(match[1]);
  return values;
}

function extractLinks(html) {
  return [...new Set(extractAttr(html, "a", "href"))];
}

function routeFromUrl(url) {
  try {
    return new URL(url).pathname;
  } catch {
    return null;
  }
}

function hasMojibake(html) {
  return /Ã|Ä|Å|â|Â/.test(html);
}

async function getToken() {
  const { response, payload } = await apiRequest("/auth/login", {
    method: "POST",
    body: { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD }
  });
  if (response.status !== 201 || !payload?.data?.accessToken) {
    throw new Error(`login failed with ${response.status}`);
  }
  return payload.data.accessToken;
}

async function auditPublicRoutes() {
  const sitemapResponse = await fetchWithTimeout(`${websiteUrl}/sitemap.xml`);
  const sitemap = await sitemapResponse.text();
  if (!sitemapResponse.ok) {
    addResult("SEO", "sitemap.xml", "fail", `HTTP ${sitemapResponse.status}`);
    return [];
  }
  addResult("SEO", "sitemap.xml", "pass");

  const routes = [...new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => routeFromUrl(m[1])).filter(Boolean))];
  addResult("Public Routes", "routes discovered from sitemap", routes.length > 0 ? "pass" : "fail", `${routes.length} routes`);

  let checked = 0;
  let failed = 0;
  let seoWarnings = 0;
  const allLinks = new Map();

  for (const route of routes) {
    const response = await fetchWithTimeout(`${websiteUrl}${route}`);
    const html = await response.text();
    checked += 1;
    if (response.status !== 200) {
      failed += 1;
      addResult("Public Routes", route, "fail", `HTTP ${response.status}`);
      continue;
    }

    const titleOk = /<title>[^<]{8,}<\/title>/i.test(html);
    const descriptionOk = /<meta\s+name=["']description["']\s+content=["'][^"']{20,}["']/i.test(html);
    const h1Count = (html.match(/<h1\b/gi) ?? []).length;
    const mojibake = hasMojibake(html);
    const links = extractLinks(html);
    for (const href of links) {
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      if (href === "#" || href.startsWith("/#") || href.includes("javascript:")) {
        allLinks.set(`${route} -> ${href}`, "invalid href");
      } else {
        allLinks.set(href.split("#")[0] || "/", "internal");
      }
    }

    if (!titleOk || !descriptionOk || h1Count !== 1 || mojibake) {
      seoWarnings += 1;
      addResult(
        "SEO",
        route,
        "warn",
        `title=${titleOk} description=${descriptionOk} h1=${h1Count} mojibake=${mojibake}`
      );
    }
  }

  addResult("Public Routes", "all sitemap routes return 200", failed === 0 ? "pass" : "fail", `${checked - failed}/${checked} passed`);

  let brokenLinks = 0;
  for (const [href, reason] of allLinks) {
    if (reason !== "internal") {
      brokenLinks += 1;
      addResult("Links", href, "fail", reason);
      continue;
    }
    const response = await fetchWithTimeout(`${websiteUrl}${href}`, { method: "HEAD" });
    if (response.status >= 400) {
      brokenLinks += 1;
      addResult("Links", href, "fail", `HTTP ${response.status}`);
    }
  }
  addResult("Links", "internal header/footer/CTA links", brokenLinks === 0 ? "pass" : "fail", `${allLinks.size - brokenLinks}/${allLinks.size} passed`);
  addResult("SEO", "metadata smoke", seoWarnings === 0 ? "pass" : "warn", `${seoWarnings} route warnings`);

  const robotsResponse = await fetchWithTimeout(`${websiteUrl}/robots.txt`);
  const robots = await robotsResponse.text();
  addResult("SEO", "robots.txt", robotsResponse.ok && robots.includes("Sitemap:") ? "pass" : "fail", `HTTP ${robotsResponse.status}`);

  return routes;
}

async function auditApiAndCrm(token) {
  const protectedPaths = [
    "/dashboard",
    "/dashboard/trend",
    "/candidates?page=1&limit=5",
    "/families?page=1&limit=5",
    "/family-requests?page=1&limit=5",
    "/api/v1/admin/website/dashboard",
    "/api/v1/admin/website/settings"
  ];

  const health = await apiRequest("/health");
  addResult("API", "GET /health", health.response.status === 200 ? "pass" : "fail", `HTTP ${health.response.status}`);

  const unauthorized = await apiRequest("/api/v1/admin/website/settings");
  addResult("Security", "admin endpoint rejects anonymous user", unauthorized.response.status === 401 ? "pass" : "fail", `HTTP ${unauthorized.response.status}`);

  for (const path of protectedPaths) {
    const { response } = await apiRequest(path, { token });
    addResult("API", `GET ${path}`, response.status === 200 ? "pass" : "fail", `HTTP ${response.status}`);
  }
}

async function auditFormsAndCrm(token) {
  const stamp = nowId();
  const familyPhone = `+90555${String(Date.now()).slice(-7)}`;
  const nannyPhone = `+90554${String(Date.now()).slice(-7)}`;

  const family = await apiRequest("/api/v1/public/applications/family", {
    method: "POST",
    body: {
      full_name: `Codex QA Aile ${stamp}`,
      phone: familyPhone,
      email: `codex.family.${stamp}@example.com`,
      city: "Istanbul",
      district: "Kadikoy",
      service_type: "yatili-dadi",
      notes: "Automated QA submission",
      source: "CODEX_AUDIT",
      idempotency_key: `family-${stamp}`,
      consent: true,
      payload: { audit: true }
    }
  });
  addResult("Forms", "family application submit", family.response.status === 201 ? "pass" : "fail", `HTTP ${family.response.status}`);

  const nanny = await apiRequest("/api/v1/public/applications/nanny", {
    method: "POST",
    body: {
      full_name: `Codex QA Aday ${stamp}`,
      phone: nannyPhone,
      email: `codex.nanny.${stamp}@example.com`,
      birth_date: "1995-01-01",
      city: "Istanbul",
      district: "Besiktas",
      source: "CODEX_AUDIT",
      idempotency_key: `nanny-${stamp}`,
      consent: true,
      payload: { audit: true }
    }
  });
  addResult("Forms", "nanny application submit", nanny.response.status === 201 ? "pass" : "fail", `HTTP ${nanny.response.status}`);

  const contact = await apiRequest("/api/v1/public/contact-requests", {
    method: "POST",
    body: {
      full_name: `Codex QA Contact ${stamp}`,
      phone: `+90553${String(Date.now()).slice(-7)}`,
      email: `codex.contact.${stamp}@example.com`,
      message: "Automated QA contact request",
      source: "CODEX_AUDIT",
      idempotency_key: `contact-${stamp}`,
      consent: true
    }
  });
  addResult("Forms", "contact request submit", contact.response.status === 201 ? "pass" : "fail", `HTTP ${contact.response.status}`);

  const callback = await apiRequest("/api/v1/public/callback-requests", {
    method: "POST",
    body: {
      full_name: `Codex QA Callback ${stamp}`,
      phone: `+90552${String(Date.now()).slice(-7)}`,
      email: `codex.callback.${stamp}@example.com`,
      message: "Automated QA callback request",
      preferred_time: "Hafta ici ogleden sonra",
      source: "CODEX_AUDIT",
      idempotency_key: `callback-${stamp}`,
      consent: true
    }
  });
  addResult("Forms", "callback request submit", callback.response.status === 201 ? "pass" : "fail", `HTTP ${callback.response.status}`);

  const newsletter = await apiRequest("/api/v1/public/newsletter-subscriptions", {
    method: "POST",
    body: {
      full_name: `Codex QA Newsletter ${stamp}`,
      email: `codex.newsletter.${stamp}@example.com`,
      source: "CODEX_AUDIT",
      idempotency_key: `newsletter-${stamp}`,
      consent: true,
      marketing_consent: true
    }
  });
  addResult("Forms", "newsletter subscription submit", newsletter.response.status === 201 ? "pass" : "fail", `HTTP ${newsletter.response.status}`);

  const submissions = await apiRequest("/api/v1/admin/website/form-submissions", { token });
  const rows = submissions.payload?.data ?? [];
  const foundFamily = rows.some((row) => row.form_type === "family_application" && row.crm_entity_type === "FamilyRequest");
  const foundNanny = rows.some((row) => row.form_type === "nanny_application" && row.crm_entity_type === "CandidateApplication");
  const foundCallback = rows.some((row) => row.form_type === "callback_request" && row.idempotency_key === `callback-${stamp}`);
  const foundNewsletter = rows.some((row) => row.form_type === "newsletter_subscription" && row.idempotency_key === `newsletter-${stamp}`);
  addResult("CRM Integration", "family submission creates CRM entity", foundFamily ? "pass" : "fail");
  addResult("CRM Integration", "nanny submission creates CRM entity", foundNanny ? "pass" : "fail");
  addResult("CRM Integration", "callback request creates CRM submission", foundCallback ? "pass" : "fail");
  addResult("CRM Integration", "newsletter creates CRM submission", foundNewsletter ? "pass" : "fail");
}

async function auditCmsAndMedia(token) {
  const marker = `Codex QA ${new Date().toISOString()}`;
  const settings = await apiRequest("/api/v1/admin/website/settings", { token });
  const currentContact = (settings.payload?.data ?? []).find((row) => row.key === "global.contact")?.value ?? {};

  const whatsappValue = "+905550001122";
  let updated = false;
  try {
    const update = await apiRequest("/api/v1/admin/website/settings", {
      method: "PATCH",
      token,
      body: {
        key: "global.contact",
        group: "global",
        value: { ...currentContact, whatsapp: whatsappValue, callbackLabel: marker }
      }
    });
    updated = update.response.status === 200;
    addResult("CMS", "update WhatsApp/contact setting", updated ? "pass" : "fail", `HTTP ${update.response.status}`);

    const publicSettings = await apiRequest("/api/v1/public/site-settings");
    const reflected = publicSettings.payload?.data?.["global.contact"]?.whatsapp === whatsappValue;
    addResult("CMS", "contact setting reflects in public API", reflected ? "pass" : "fail");

    const anonymousBlob = new Blob(["not-an-image"], { type: "text/plain" });
    const anonymousForm = new FormData();
    anonymousForm.append("file", anonymousBlob, "bad.txt");
    const anonymousMediaResponse = await fetchWithTimeout(`${crmUrl}/api/website-media`, {
      method: "POST",
      body: anonymousForm
    });
    addResult(
      "Security",
      "media upload rejects anonymous user",
      anonymousMediaResponse.status === 401 ? "pass" : "fail",
      `HTTP ${anonymousMediaResponse.status}`
    );

    const blob = new Blob(["not-an-image"], { type: "text/plain" });
    const form = new FormData();
    form.append("file", blob, "bad.txt");
    const mediaResponse = await fetchWithTimeout(`${crmUrl}/api/website-media`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: form
    });
    addResult("Security", "media upload rejects non-image", mediaResponse.status === 400 ? "pass" : "fail", `HTTP ${mediaResponse.status}`);
  } finally {
    if (updated) {
      const restore = await apiRequest("/api/v1/admin/website/settings", {
        method: "PATCH",
        token,
        body: {
          key: "global.contact",
          group: "global",
          value: currentContact
        }
      });
      addResult(
        "CMS",
        "restore contact setting after audit",
        restore.response.status === 200 ? "pass" : "fail",
        `HTTP ${restore.response.status}`
      );
    }
  }
}

async function auditCmsContent(token) {
  const stamp = nowId();
  const slug = `codex-qa-page-${stamp}`;
  const create = await apiRequest("/api/v1/admin/website/pages", {
    method: "POST",
    token,
    body: {
      type: "PAGE",
      slug,
      title: `Codex QA Page ${stamp}`,
      status: "PUBLISHED",
      hero_title: `Codex QA Hero ${stamp}`,
      hero_subtitle: "Automated CMS publication test",
      payload: {
        sections: [
          {
            type: "body",
            body: "This page was created by the turnkey audit and should be deleted by the same audit run."
          }
        ]
      },
      seo_title: `Codex QA SEO ${stamp}`,
      meta_description: "Automated CMS smoke test page used to verify public content reflection."
    }
  });
  const createdId = create.payload?.data?.id;
  addResult("CMS", "create published page", create.response.status === 201 && createdId ? "pass" : "fail", `HTTP ${create.response.status}`);

  const publicCreated = await apiRequest(`/api/v1/public/pages/${slug}`);
  const publicCreateOk = publicCreated.response.status === 200 && publicCreated.payload?.data?.slug === slug;
  addResult("CMS", "created page reflects in public API", publicCreateOk ? "pass" : "fail", `HTTP ${publicCreated.response.status}`);

  if (!createdId) return;

  const updatedTitle = `Codex QA Updated ${stamp}`;
  const update = await apiRequest(`/api/v1/admin/website/pages/${createdId}`, {
    method: "PATCH",
    token,
    body: {
      type: "PAGE",
      slug,
      title: updatedTitle,
      status: "PUBLISHED",
      hero_title: updatedTitle,
      hero_subtitle: "Automated CMS update test",
      payload: { sections: [{ type: "body", body: "Updated by turnkey audit." }] },
      seo_title: updatedTitle,
      meta_description: "Automated CMS smoke test page after update."
    }
  });
  addResult("CMS", "update published page", update.response.status === 200 ? "pass" : "fail", `HTTP ${update.response.status}`);

  const publicUpdated = await apiRequest(`/api/v1/public/pages/${slug}`);
  const publicUpdateOk = publicUpdated.payload?.data?.title === updatedTitle;
  addResult("CMS", "updated page reflects in public API", publicUpdateOk ? "pass" : "fail", `title=${publicUpdated.payload?.data?.title ?? "missing"}`);

  const deleted = await apiRequest(`/api/v1/admin/website/pages/${createdId}`, { method: "DELETE", token });
  addResult("CMS", "delete audit page", deleted.response.status === 200 ? "pass" : "fail", `HTTP ${deleted.response.status}`);
}

async function main() {
  console.log(`Turnkey audit started ${new Date().toISOString()}`);
  console.log(`Website=${websiteUrl} CRM=${crmUrl} API=${apiUrl}`);

  const token = await getToken();
  addResult("Auth", "admin login", "pass");

  await auditApiAndCrm(token);
  await auditPublicRoutes();
  await auditFormsAndCrm(token);
  await auditCmsAndMedia(token);
  await auditCmsContent(token);

  const total = results.length;
  const failed = results.filter((item) => item.status === "fail").length;
  const warned = results.filter((item) => item.status === "warn").length;
  const passed = results.filter((item) => item.status === "pass").length;

  console.log(`Completed total=${total} passed=${passed} warned=${warned} failed=${failed}`);
  console.log(JSON.stringify({ total, passed, warned, failed, results }, null, 2));

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exit(1);
});
