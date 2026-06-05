const DEFAULT_API_URL = process.env.SMOKE_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const DEFAULT_EMAIL = process.env.SMOKE_ADMIN_EMAIL ?? "admin@dadikapida.local";
const DEFAULT_PASSWORD = process.env.SMOKE_ADMIN_PASSWORD ?? "admin123";

function parseArg(flag) {
  const index = process.argv.findIndex((arg) => arg === flag);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
}

function trimTrailingSlash(url) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

const API_URL = trimTrailingSlash(parseArg("--api-url") ?? DEFAULT_API_URL);
const LOGIN_EMAIL = parseArg("--email") ?? DEFAULT_EMAIL;
const LOGIN_PASSWORD = parseArg("--password") ?? DEFAULT_PASSWORD;
const TIMEOUT_MS = Number.parseInt(parseArg("--timeout-ms") ?? "12000", 10);

const checks = [];

function addCheck(name, run) {
  checks.push({ name, run });
}

async function runRequest(method, path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        "content-type": "application/json",
        ...(options.token ? { authorization: `Bearer ${options.token}` } : {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });

    let payload = null;
    const text = await response.text();
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = { raw: text };
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      payload,
      requestId: response.headers.get("x-request-id") ?? undefined
    };
  } finally {
    clearTimeout(timeout);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  let token;

  addCheck("GET /health", async () => {
    const result = await runRequest("GET", "/health");
    assert(result.status === 200, `expected 200, got ${result.status}`);
    assert(result.payload?.data?.status === "ok", "health payload missing data.status=ok");
    assert(result.requestId, "x-request-id header missing");
  });

  addCheck("POST /auth/login", async () => {
    const result = await runRequest("POST", "/auth/login", {
      body: { email: LOGIN_EMAIL, password: LOGIN_PASSWORD }
    });
    assert(result.status === 201, `expected 201, got ${result.status}`);
    token = result.payload?.data?.accessToken;
    assert(typeof token === "string" && token.length > 20, "accessToken missing");
    assert(result.requestId, "x-request-id header missing");
  });

  addCheck("GET /auth/me", async () => {
    const result = await runRequest("GET", "/auth/me", { token });
    assert(result.status === 200, `expected 200, got ${result.status}`);
    assert(result.payload?.data?.email, "auth/me payload missing email");
    assert(result.requestId, "x-request-id header missing");
  });

  const protectedReads = [
    "/dashboard",
    "/candidates?page=1&limit=5",
    "/families?page=1&limit=5",
    "/family-requests?page=1&limit=5",
    "/reports/dashboard",
    "/audit-logs?page=1&limit=5"
  ];

  for (const path of protectedReads) {
    addCheck(`GET ${path}`, async () => {
      const result = await runRequest("GET", path, { token });
      assert(result.status === 200, `expected 200, got ${result.status}`);
      assert(result.requestId, "x-request-id header missing");
    });
  }

  const startedAt = Date.now();
  let failed = 0;

  console.log(`Smoke check started: ${new Date(startedAt).toISOString()}`);
  console.log(`Target API: ${API_URL}`);

  for (const check of checks) {
    const t0 = Date.now();
    try {
      await check.run();
      const duration = Date.now() - t0;
      console.log(`[PASS] ${check.name} (${duration}ms)`);
    } catch (error) {
      failed += 1;
      const duration = Date.now() - t0;
      const message = error instanceof Error ? error.message : String(error);
      console.log(`[FAIL] ${check.name} (${duration}ms) -> ${message}`);
    }
  }

  const totalMs = Date.now() - startedAt;
  console.log(`Completed in ${totalMs}ms | total=${checks.length} failed=${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Smoke check crashed: ${message}`);
  process.exit(1);
});
