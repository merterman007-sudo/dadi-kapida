// SSR: uses API_BASE_URL (Docker internal: http://api:3001)
// CSR: uses NEXT_PUBLIC_API_BASE_URL (browser: http://localhost:3001)
const API_BASE_URL =
  typeof window === "undefined"
    ? (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001")
    : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001");
const FETCH_TIMEOUT_MS = 8000;

type ApiEnvelope<T> = {
  data: T;
  error: { message?: string } | null;
};

type ExtendedRequestInit = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

async function fetchJson(url: string, init?: ExtendedRequestInit, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal
    });
    const payload = await response.json();
    return { response, payload };
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchPublic<T>(path: string, fallback: T): Promise<T> {
  try {
    const { response, payload } = (await fetchJson(`${API_BASE_URL}${path}`, {
      next: { revalidate: 60 }
    })) as { response: Response; payload: ApiEnvelope<T> };
    if (!response.ok || payload.error) {
      return fallback;
    }
    return payload.data;
  } catch {
    return fallback;
  }
}

export async function postPublic<T>(path: string, body: unknown): Promise<T> {
  const { response, payload } = (await fetchJson(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  })) as { response: Response; payload: ApiEnvelope<T> };
  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message ?? "Request failed");
  }

  return payload.data;
}
