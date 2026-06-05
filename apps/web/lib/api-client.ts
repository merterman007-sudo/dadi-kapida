"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type ApiEnvelope<T> = {
  data: T;
  meta: Record<string, unknown>;
  error: { message?: string } | null;
};

function forceLogoutForAuthError() {
  window.localStorage.removeItem("crm_access_token");
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = window.localStorage.getItem("crm_access_token");
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  let payload: ApiEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    payload = null;
  }

  const errorMessage = payload?.error?.message;
  const isAuthError =
    response.status === 401 ||
    errorMessage === "Invalid access token" ||
    errorMessage === "Missing bearer token";

  if (isAuthError) {
    forceLogoutForAuthError();
    throw new Error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
  }

  if (!response.ok || payload?.error) {
    throw new Error(errorMessage ?? "İstek başarısız.");
  }

  if (!payload) {
    throw new Error("Geçersiz sunucu yanıtı.");
  }

  return payload.data;
}
